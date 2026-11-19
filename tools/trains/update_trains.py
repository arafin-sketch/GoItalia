#!/usr/bin/env python3
"""Fetch live train departure boards for Italy's main stations from RFI's ViaggiaTreno.

ViaggiaTreno is the official public train-information service (the data shown on station
departure boards: train, destination, scheduled time, real-time delay and platform).
Transitous has little real-time rail data for Italy, so ItaliaNow reads the boards here
instead. The app cannot call ViaggiaTreno from the browser (plain HTTP, no CORS, bot
protection), so this script runs in GitHub Actions every few minutes and publishes a
small JSON board the app reads as a static file.

If a station can't be read, its previous board is kept and marked stale, so the app never
shows an empty or outdated-looking board without saying so.

    python3 tools/trains/update_trains.py            # fetch live boards
    python3 tools/trains/update_trains.py --dir DIR  # parse saved partenze JSON (CODE.json)

Only the Python standard library is needed.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import sys
import time
import urllib.request
from zoneinfo import ZoneInfo

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "preview", "data", "trains.json")
BASE = "http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
TZ = ZoneInfo("Europe/Rome")

# main rail stations per city (ViaggiaTreno code, display name, city, lat, lon)
STATIONS = [
    ("S08409", "Roma Termini", "rome", 41.9009, 12.5016),
    ("S08217", "Roma Tiburtina", "rome", 41.9107, 12.5302),
    ("S01700", "Milano Centrale", "milan", 45.4863, 9.2051),
    ("S01645", "Milano Porta Garibaldi", "milan", 45.4847, 9.1877),
    ("S01066", "Milano Cadorna", "milan", 45.4686, 9.1760),
    ("S09218", "Napoli Centrale", "naples", 40.8520, 14.2727),
    ("S09103", "Napoli Campi Flegrei", "naples", 40.8322, 14.1920),
    ("S00219", "Torino Porta Nuova", "turin", 45.0614, 7.6779),
    ("S00035", "Torino Porta Susa", "turin", 45.0722, 7.6657),
    ("S04700", "Genova Piazza Principe", "genoa", 44.4169, 8.9190),
    ("S04702", "Genova Brignole", "genoa", 44.4079, 8.9402),
    ("S12332", "Catania Centrale", "catania", 37.5100, 15.1030),
]
CAT = {"Frecciarossa": "FR", "Frecciargento": "FA", "Frecciabianca": "FB", "Regionale": "REG",
       "Regionale Veloce": "RV", "Intercity": "IC", "Intercity Notte": "ICN", "EuroCity": "EC",
       "EuroNight": "EN", "Italo": "ITA"}


def fetch(code: str):
    now = dt.datetime.now(TZ).strftime("%a %b %d %Y %H:%M:%S GMT%z").replace(" ", "%20")
    url = f"{BASE}/partenze/{code}/{now}"
    req = urllib.request.Request(url, headers={
        "User-Agent": UA, "Accept": "application/json, text/plain, */*",
        "Referer": "http://www.viaggiatreno.it/infomobilita/index.jsp"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.load(r)


def board(raw):
    out = []
    for x in raw:
        cat = (x.get("categoria") or "").strip() or CAT.get((x.get("categoriaDescrizione") or "").strip(), (x.get("categoriaDescrizione") or "").strip())
        plat = (x.get("binarioEffettivoPartenzaDescrizione") or x.get("binarioProgrammatoPartenzaDescrizione") or "").strip()
        rit = x.get("ritardo")
        tracked = not x.get("nonPartito", True)  # ViaggiaTreno reports a delay only once the train is running
        out.append({
            "n": str(x.get("numeroTreno") or "").strip(),
            "c": cat,
            "to": (x.get("destinazione") or "").strip(),
            "t": (x.get("compOrarioPartenza") or "").strip(),
            "d": rit if (tracked and rit is not None) else None,
            "p": plat,
            "x": x.get("provvedimento") == 1,          # soppresso / cancelled
            "part": x.get("provvedimento") == 2,        # partially cancelled
            "g": tracked and not x.get("inStazione", False),  # already left
        })
    return out[:12]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir")
    a = ap.parse_args()
    prev = {}
    if os.path.exists(OUT):
        try:
            for s in json.load(open(OUT, encoding="utf-8")).get("stations", []):
                prev[s["code"]] = s
        except Exception:
            pass
    now_iso = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    stations, report, ok_any = [], [], False
    for code, name, city, lat, lon in STATIONS:
        try:
            raw = json.load(open(os.path.join(a.dir, code + ".json"), encoding="utf-8")) if a.dir else fetch(code)
            dep = board(raw)
            stations.append({"code": code, "name": name, "city": city, "lat": lat, "lon": lon, "dep": dep, "at": now_iso})
            report.append(f"{name}: {len(dep)} departures ({sum(1 for d in dep if d['d'] is not None)} with live delay)")
            ok_any = True
        except Exception as e:
            old = prev.get(code)
            if old:
                old["stale"] = True
                stations.append(old)
                report.append(f"{name}: FAILED ({e.__class__.__name__}); keeping board from {old.get('at')}")
            else:
                report.append(f"{name}: FAILED ({e.__class__.__name__}); no previous board")
        if not a.dir:
            time.sleep(1.0)  # be gentle on ViaggiaTreno
    if not ok_any and prev:
        print("\n".join(report)); print("ALL FETCHES FAILED — keeping existing trains.json unchanged"); return 0
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump({"updated": now_iso, "source": "ViaggiaTreno (RFI)", "stations": stations}, f, ensure_ascii=False, separators=(",", ":"))
    print("\n".join(report))
    print(f"wrote {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
