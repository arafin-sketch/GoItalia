#!/usr/bin/env python3
"""Build a searchable index of EVERY public transport line per city (bus, tram, metro,
rail, funicular, ferry) from the operators' official GTFS feeds.

Output: preview/data/lines/<city>.json (also used by the Flutter app as an asset), with
  stops  : [[name, lat*1e5, lon*1e5, code], ...]
  routes : [{"id", "s" short name, "l" long name, "m" mode, "c" colour or "",
             "p": [[stop index, ...] per direction], "sh": [[lat*1e5, lon*1e5, ...] per direction]}]

Each direction keeps its most frequent stop pattern. Long names fall back to
"first stop – last stop" when the feed has none (as in Rome's ATAC feed).

Usage:
    python3 tools/dataset/build_lines_index.py [--cache DIR] [--only rome,milan]
It reuses the feed list and download cache of build_offline_dataset.py.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from collections import Counter, defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_offline_dataset import CITIES, download, read_csv, rdp, title_case, log  # noqa: E402

MODE = {0: "tram", 1: "metro", 2: "rail", 3: "bus", 4: "ferry", 5: "funicular", 6: "funicular", 7: "funicular", 11: "bus", 12: "rail"}


def mode_of(route_type: str) -> str:
    try:
        t = int(route_type)
    except ValueError:
        return "bus"
    if t in MODE:
        return MODE[t]
    if 100 <= t < 200: return "rail"
    if 200 <= t < 300 or 700 <= t < 800 or 800 <= t < 900: return "bus"
    if 400 <= t < 500: return "metro"
    if 900 <= t < 1000: return "tram"
    if 1000 <= t < 1300: return "ferry"
    if 1300 <= t < 1500: return "funicular"
    return "bus"


def display_name(n: str) -> str:
    import re
    n = (n or "").strip()
    n = title_case(n) if n.isupper() and len(n) > 3 else n
    n = re.sub(r"([/(\-])([a-zà-ù])", lambda m: m.group(1) + m.group(2).upper(), n)  # Tiburtina/Castro
    return re.sub(r"\(([^()]{1,12})\)", lambda m: "(" + m.group(1).upper() + ")", n)  # (MA-MB-FS), (FL3)


def build(key, cfg, zpath):
    import zipfile
    z = zipfile.ZipFile(zpath)
    routes = {r["route_id"]: r for r in read_csv(z, "routes.txt")}
    overrides = {rid: v for rid, v in cfg["lines"].items()}  # metro codes and colours from the main dataset
    trips = {t["trip_id"]: t for t in read_csv(z, "trips.txt") if t["route_id"] in routes}

    seqs = defaultdict(list)
    for st in read_csv(z, "stop_times.txt"):
        if st["trip_id"] in trips:
            seqs[st["trip_id"]].append((int(st["stop_sequence"]), st["stop_id"]))

    # pattern counts per route and direction
    pats = defaultdict(Counter)
    pat_shape = defaultdict(Counter)
    for tid, s in seqs.items():
        s.sort()
        t = trips[tid]
        pat = tuple(x[1] for x in s)
        if len(pat) < 2:
            continue
        k = (t["route_id"], t.get("direction_id") or "")
        pats[k][pat] += 1
        if t.get("shape_id"):
            pat_shape[(k, pat)][t["shape_id"]] += 1

    chosen = {}  # route_id -> [(pattern, shape_id)]
    by_route = defaultdict(list)
    for (rid, d), c in pats.items():
        by_route[rid].append((d, c))
    for rid, dirs in by_route.items():
        out = []
        if len(dirs) >= 2 and any(d for d, _ in dirs):
            for d, c in sorted(dirs)[:2]:
                p = c.most_common(1)[0][0]
                out.append(p)
        else:  # no direction_id: most common pattern, plus the most common one going the other way
            c = dirs[0][1] if len(dirs) == 1 else sum((x for _, x in dirs), Counter())
            ranked = [p for p, _ in c.most_common()]
            out.append(ranked[0])
            other = next((p for p in ranked[1:] if p[0] != ranked[0][0] and p[0] in ranked[0][len(ranked[0]) // 2:]), None)
            if other:
                out.append(other)
        chosen[rid] = out

    used = {s for ps in chosen.values() for p in ps for s in p}
    stops_raw = {s["stop_id"]: s for s in read_csv(z, "stops.txt") if s["stop_id"] in used}
    stop_idx, stops_out = {}, []
    for sid in sorted(used):
        s = stops_raw.get(sid)
        if not s:
            continue
        stop_idx[sid] = len(stops_out)
        stops_out.append([display_name(s["stop_name"]), round(float(s["stop_lat"]) * 1e5), round(float(s["stop_lon"]) * 1e5), s.get("stop_code") or ""])

    shapes_needed = set()
    shape_for = {}
    for rid, ps in chosen.items():
        for p in ps:
            k = next(((rid, d) for (r2, d) in pats if r2 == rid and p in pats[(r2, d)]), None)
            sc = pat_shape.get((k, p))
            if sc:
                shape_for[(rid, p)] = sc.most_common(1)[0][0]
                shapes_needed.add(shape_for[(rid, p)])
    shapes = defaultdict(list)
    if shapes_needed:
        for pt in read_csv(z, "shapes.txt") or []:
            if pt["shape_id"] in shapes_needed:
                shapes[pt["shape_id"]].append((int(pt["shape_pt_sequence"]), float(pt["shape_pt_lat"]), float(pt["shape_pt_lon"])))

    out_routes = []
    for rid, ps in chosen.items():
        r = routes[rid]
        mode = mode_of(r.get("route_type", "3"))
        short = (r.get("route_short_name") or "").strip()
        colour = (r.get("route_color") or "").strip().upper()
        if rid in overrides:
            short, ov_mode, ov_col = overrides[rid]
            mode = {"metro": "metro", "tram": "tram", "rail": "rail", "funicular": "funicular"}[ov_mode]
            colour = ov_col or colour
        if key == "catania" and "METRO" in (r.get("route_long_name") or "").upper():
            mode, short = "metro", "M"
        if not short or short == "NULL":
            short = (r.get("route_long_name") or rid)[:8]
        if colour in ("FFFFFF", "NONE"):
            colour = ""
        idx_pats = [[stop_idx[s] for s in p if s in stop_idx] for p in ps]
        long_name = display_name(r.get("route_long_name") or "")
        if not long_name or long_name.upper() == short.upper():
            a, b = stops_out[idx_pats[0][0]][0], stops_out[idx_pats[0][-1]][0]
            long_name = f"{a} – {b}"
        sh = []
        for p in ps:
            sid = shape_for.get((rid, p))
            pts = [(la, lo) for _, la, lo in sorted(shapes[sid])] if sid else []
            pts = rdp(pts, 15) if len(pts) > 2 else pts
            sh.append([v for la, lo in pts for v in (round(la * 1e5), round(lo * 1e5))])
        out_routes.append({"id": rid, "s": short, "l": long_name, "m": mode, "c": colour, "p": idx_pats, "sh": sh})

    order = {"metro": 0, "rail": 1, "tram": 2, "funicular": 3, "ferry": 4, "bus": 5}
    def natural(s):
        import re
        return [int(x) if x.isdigit() else x for x in re.split(r"(\d+)", s)]
    out_routes.sort(key=lambda r: (order.get(r["m"], 9), natural(r["s"])))
    log(f"  [{key}] {len(out_routes)} lines, {len(stops_out)} stops, modes {dict(Counter(r['m'] for r in out_routes))}")
    return {"city": key, "name": cfg["name"], "operator": cfg["operator"], "stops": stops_out, "routes": out_routes}


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    root = os.path.abspath(os.path.join(here, "..", ".."))
    ap = argparse.ArgumentParser()
    ap.add_argument("--cache", default=os.path.join(here, ".cache"))
    ap.add_argument("--out", default=os.path.join(root, "preview", "data", "lines"))
    ap.add_argument("--only", default="")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    only = {c for c in a.only.split(",") if c}
    for key, cfg in CITIES.items():
        if only and key not in only:
            continue
        data = build(key, cfg, download(cfg, a.cache))
        path = os.path.join(a.out, f"{key}.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
        log(f"  wrote {path} ({os.path.getsize(path) // 1024} KiB)")


if __name__ == "__main__":
    main()
