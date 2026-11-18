#!/usr/bin/env python3
"""Refresh ticket prices in preview/data/fares.json from the operators' official websites.

Runs every day in GitHub Actions (.github/workflows/fares.yml). For each city it downloads
the official page, reads the prices it knows how to find, and updates them. A city whose
page can't be read keeps its last verified prices and its own "checked" date, so the app
never shows a price that wasn't read from the official source.

    python3 tools/fares/update_fares.py            # fetch live pages
    python3 tools/fares/update_fares.py --dir DIR  # parse saved pages (rome.html, milan.html, ...)

Needs Python 3.9+ and `pdftotext` (poppler-utils) for the Naples tariff PDF.
"""
from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
FARES = os.path.join(ROOT, "preview", "data", "fares.json")
UA = "Mozilla/5.0 (compatible; ItaliaNow-fares/1.0; +https://github.com/arafin-sketch/GoItalia)"
PAGES = {
    "rome": "https://www.atac.roma.it/biglietti-e-abbonamenti",
    "milan": "https://www.atm.it/it/ViaggiaConNoi/pagamenti_servizi_digitali/Pagine/biglietto_Contactless.aspx",
    "naples": "https://www.unicocampania.it/uploads/testistatici/schema_tariffario.pdf",
    "turin": "https://www.gtt.to.it/cms/biglietti-abbonamenti/biglietti/biglietti-carnet",
    "catania": "https://www.circumetnea.it/biglietti/",
    "genoa": "https://www.amt.genova.it/amt/biglietti-e-abbonamenti/",
}
EUR = r"(\d{1,3},\d{2})"


def eur(s: str) -> float:
    return float(s.replace(",", "."))


def lines_of(raw: str) -> list[str]:
    raw = re.sub(r"(?is)<(script|style).*?</\1>", " ", raw)
    txt = html.unescape(re.sub(r"<[^>]+>", "\n", raw))
    return [re.sub(r"\s+", " ", l).strip() for l in txt.split("\n") if l.strip()]


def after(lines: list[str], label: str, within: int = 6) -> float | None:
    """First euro amount in the few lines after a line matching `label`."""
    for i, l in enumerate(lines):
        if re.search(label, l, re.I):
            for nxt in lines[i:i + within]:
                m = re.search(r"€\s*" + EUR + r"|" + EUR + r"\s*€", nxt)
                if m:
                    return eur(m.group(1) or m.group(2))
    return None


def parse_rome(raw):
    L = lines_of(raw)
    return {"bit": after(L, r"^Biglietto Integrato a Tempo$"), "24h": after(L, r"^Roma 24 ore$"), "48h": after(L, r"^Roma 48 ore$"),
            "72h": after(L, r"^Roma 72 ore$"), "cis": after(L, r"^INTEGRATA SETTIMANALE$")}


def parse_milan(raw):
    t = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", raw)))
    o = re.search(r"Mi1-Mi3 nell.{0,90}?tariffa di " + EUR + r" ?€", t)
    d = re.search(r"tariffa giornaliera\?\s*" + EUR + r" ?€ se vi spostate nelle zone Mi1-Mi3", t)
    return {"ord": eur(o.group(1)) if o else None, "day": eur(d.group(1)) if d else None}


def parse_naples(pdf_bytes):
    with tempfile.NamedTemporaryFile(suffix=".pdf") as f:
        f.write(pdf_bytes); f.flush()
        txt = subprocess.run(["pdftotext", "-layout", f.name, "-"], capture_output=True, text=True, check=True).stdout
    m = re.search(r"U NA\s+€ " + EUR + r"\s+€ " + EUR + r"\s+€ " + EUR + r"\s+€ " + EUR, txt)
    return {"orario": eur(m.group(1)), "day": eur(m.group(2)), "3d": eur(m.group(3)), "7d": eur(m.group(4))} if m else {}


def parse_turin(raw):
    t = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", re.sub(r"(?is)<(script|style).*?</\1>", " ", raw))))
    def g(p):
        m = re.search(p, t); return eur(m.group(1)) if m else None
    return {"city": g(r"Biglietto City\s*-\s*€ " + EUR + r" in digitale"), "multi": g(r"MultiCity\s*-\s*€ " + EUR),
            "daily": g(r"► Daily\s*-\s*€ " + EUR + r" in digitale"), "md7": g(r"MultiDaily 7\s*-\s*€ " + EUR),
            "tour48": g(r"Tour\" valido per 48 o 72 ore\s*-\s*€ " + EUR), "tour72": g(r"Tour\" valido per 48 o 72 ore\s*-\s*€ \d+,\d{2} / " + EUR)}


def parse_catania(raw):
    L = lines_of(raw)
    def cost(title, start=0):
        for i, l in enumerate(L[start:], start):
            if re.fullmatch(title, l, re.I):
                for nxt in L[i:i + 8]:
                    m = re.match(EUR + r" €", nxt)
                    if m:
                        return eur(m.group(1))
        return None
    mb = next((i for i, l in enumerate(L) if l == "MetroBus"), None)  # metro + AMTS bus tickets come after this heading
    out = {"single": cost(r"Corsa Semplice"), "120": cost(r"120 Minuti"), "24": cost(r"24 Ore"), "carnet": cost(r"Solo Digitale")}
    if mb is not None:
        out.update({"mb120": cost(r"120 minuti", mb), "mb24": cost(r"24 ore", mb)})
    return out


PARSERS = {"rome": parse_rome, "milan": parse_milan, "naples": parse_naples, "turin": parse_turin, "catania": parse_catania}


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", help="parse saved pages from this folder instead of downloading")
    a = ap.parse_args()
    data = json.load(open(FARES, encoding="utf-8"))
    today = dt.date.today().isoformat()
    changed, report = False, []
    for city, url in PAGES.items():
        c = data["cities"][city]
        if city not in PARSERS:
            report.append(f"{city}: no parser (official link only)"); continue
        try:
            if a.dir:
                path = os.path.join(a.dir, city + (".pdf" if city == "naples" else ".html"))
                body = open(path, "rb").read()
            else:
                body = fetch(url)
            found = PARSERS[city](body if city == "naples" else body.decode("utf-8", "ignore"))
        except Exception as e:  # site down or layout changed: keep last verified prices
            report.append(f"{city}: FAILED ({e.__class__.__name__}: {e}); keeping prices checked {c.get('checked', data['checked'])}")
            continue
        ok = {k: v for k, v in found.items() if v}
        if not ok:
            report.append(f"{city}: no prices found; keeping prices checked {c.get('checked', data['checked'])}"); continue
        for tk in c["tickets"]:
            if tk["id"] in ok and abs(tk["price"] - ok[tk["id"]]) > 0.001:
                report.append(f"{city}: {tk['id']} {tk['price']:.2f} -> {ok[tk['id']]:.2f}")
                tk["price"] = ok[tk["id"]]; changed = True
        c["checked"] = today
        report.append(f"{city}: verified {len(ok)} price(s): " + ", ".join(f"{k} {v:.2f}" for k, v in ok.items()))
    data["checked"] = today
    with open(FARES, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2); f.write("\n")
    print("\n".join(report))
    print("PRICES CHANGED" if changed else "prices unchanged")


if __name__ == "__main__":
    sys.exit(main())
