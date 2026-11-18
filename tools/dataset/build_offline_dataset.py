#!/usr/bin/env python3
"""Build ItaliaNow's bundled offline rail network from official GTFS feeds.

The script downloads each operator's latest GTFS (via the Mobility Database
mirror, which re-hosts the operators' own published feeds), keeps only the
metro / tram / funicular / suburban-rail routes listed in CITIES, and writes a
compact JSON network to assets/data/network.json:

  * lines with official colours, every branch as an ordered station list,
  * stations with coordinates (parent stations merged),
  * median run time between consecutive stations,
  * service headways per time band, from the weekday timetable,
  * simplified shapes for drawing on the map,
  * walking interchanges between nearby stations of different lines.

Nothing in the output is typed by hand except the colour overrides below,
which follow each operator's brand guide where the GTFS colour is missing or
unreadable.

Usage:
    python3 tools/dataset/build_offline_dataset.py            # download + build
    python3 tools/dataset/build_offline_dataset.py --cache DIR # reuse zips in DIR
    python3 tools/dataset/build_offline_dataset.py --only rome,milan

Only the Python 3.9+ standard library is needed.
"""
from __future__ import annotations

import argparse
import csv
import datetime as dt
import io
import json
import math
import os
import statistics
import sys
import urllib.request
import zipfile
from collections import Counter, defaultdict

MDB = "https://storage.googleapis.com/storage/v1/b/mdb-latest/o/{}?alt=media"
USER_AGENT = "ItaliaNow-dataset-builder/1.0 (+https://github.com/arafin-sketch/GoItalia)"

# route selector: either a set of route_types or explicit route_ids.
# 'lines' maps GTFS route_id -> (display code, mode, colour override or None).
CITIES = {
    "rome": {
        "name": "Roma",
        "operator": "ATAC / Roma Servizi per la Mobilità",
        "mdb_id": "mdb-1294",
        "file": "it-lazio-roma-servizi-per-la-mobilita-gtfs-1294.zip",
        "license": "CC BY 4.0",
        "license_url": "https://romamobilita.it/it/tecnologie/open-data",
        "lines": {
            "MEA": ("A", "metro", "E8792C"),
            "MEB": ("B", "metro", "0570B5"),
            "MEB1": ("B1", "metro", "0570B5"),
            "MEC": ("C", "metro", "008456"),
            "2": ("2", "tram", None),
            "3": ("3", "tram", None),
            "5": ("5", "tram", None),
            "8": ("8", "tram", None),
            "RMG": ("Termini–Centocelle", "rail", "B0559C"),
        },
        "tram_colour": "C8102E",
    },
    "milan": {
        "name": "Milano",
        "operator": "ATM Milano",
        "mdb_id": "mdb-2666",
        "file": "it-lombardia-milan-atm-gtfs-2666.zip",
        "license": "CC BY 4.0 (Comune di Milano)",
        "license_url": "https://dati.comune.milano.it/dataset/ds929-orari-del-trasporto-pubblico-locale-nel-comune-di-milano-in-formato-gtfs",
        "lines": {
            "M1": ("M1", "metro", "E3051B"),
            "M2": ("M2", "metro", "009A3E"),
            "M3": ("M3", "metro", "F7B500"),
            "M4": ("M4", "metro", "002F87"),
            "M5": ("M5", "metro", "8E75B0"),
            **{f"T{n}": (str(n), "tram", None) for n in (1, 2, 3, 4, 5, 7, 9, 10, 12, 14, 15, 16, 19, 24, 27, 31, 33)},
        },
        "tram_colour": "F28E00",
    },
    "naples": {
        "name": "Napoli",
        "operator": "ANM / EAV",
        "mdb_id": "mdb-893",
        "file": "it-campania-azienda-napoletana-mobilita-gtfs-893.zip",
        "license": "IODL 2.0 (ANM)",
        "license_url": "https://www.anm.it/",
        "lines": {
            "4909": ("L1", "metro", "F8C300"),
            "4778": ("L2", "rail", "4E78BA"),
            "2302": ("L6", "metro", "179ED6"),
            "2305": ("F1", "funicular", "E07A10"),
            "2315": ("F3", "funicular", "E07A10"),
            "2300": ("F4", "funicular", "E07A10"),
        },
    },
    "turin": {
        "name": "Torino",
        "operator": "GTT",
        "mdb_id": "mdb-2687",
        "file": "it-piedmont-turin-gruppo-torinese-trasporti-gtfs-2687.zip",
        "license": "GTT open data licence (attribution)",
        "license_url": "https://www.gtt.to.it/gtt_gtfs_license.html",
        "lines": {
            "METROU": ("M1", "metro", "E2001A"),
            **{f"{n}U": (str(n), "tram", None) for n in (3, 4, 9, 10, 13, 15)},
            "16CDU": ("16CD", "tram", None),
            "16CSU": ("16CS", "tram", None),
            "79U": ("79", "funicular", "3F8F2F"),
        },
        "tram_colour": "B35A00",
    },
    "genoa": {
        "name": "Genova",
        "operator": "AMT Genova",
        "mdb_id": "mdb-2610",
        "file": "it-liguria-amt-genova-gtfs-2610.zip",
        "license": "CC BY 4.0 (AMT Genova)",
        "license_url": "https://www.amt.genova.it/amt/",
        "lines": {
            "MM-91": ("M", "metro", "D2232A"),
            "FGC-164": ("Genova–Casella", "rail", "1D6E3A"),
            "FGR-169": ("Granarolo", "funicular", "5B6770"),
            "FRI-169": ("Zecca–Righi", "funicular", "5B6770"),
        },
    },
    "catania": {
        "name": "Catania",
        "operator": "FCE – Ferrovia Circumetnea",
        "mdb_id": "mdb-3124",
        "file": "it-metropolitana-di-catania-ferrovia-circumetnea-gtfs-3124.zip",
        "license": "CC BY 4.0 (FCE)",
        "license_url": "https://www.circumetnea.it/",
        "lines": {"53": ("M", "metro", "00539F")},
    },
}

MODE_ORDER = {"metro": 0, "rail": 1, "tram": 2, "funicular": 3}
TIME_BANDS = [(5, 7), (7, 10), (10, 16), (16, 20), (20, 24)]  # local hours
WALK_SPEED = 1.2   # m/s
TRANSFER_RADIUS = 250  # m, interchange between different stations
SAME_NAME_RADIUS = 500
MERGE_RADIUS = 400  # m, same-name stops merged into one station
SAME_LINE_RADIUS = 110  # m, differently named platforms of the same route


def log(*a):
    print(*a, file=sys.stderr)


def haversine(a, b):
    lat1, lon1, lat2, lon2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    h = math.sin((lat2 - lat1) / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin((lon2 - lon1) / 2) ** 2
    return 6371000 * 2 * math.asin(math.sqrt(h))


def rdp(points, eps):
    """Ramer-Douglas-Peucker on (lat, lon) using a local metre projection."""
    if len(points) < 3:
        return points
    lat0 = math.radians(points[0][0])
    xy = [(p[1] * 111320 * math.cos(lat0), p[0] * 110540) for p in points]
    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        s, e = stack.pop()
        (x1, y1), (x2, y2) = xy[s], xy[e]
        dx, dy = x2 - x1, y2 - y1
        norm = math.hypot(dx, dy) or 1e-9
        best, idx = 0.0, -1
        for i in range(s + 1, e):
            d = abs(dy * xy[i][0] - dx * xy[i][1] + x2 * y1 - y2 * x1) / norm
            if d > best:
                best, idx = d, i
        if best > eps and idx > 0:
            keep[idx] = True
            stack += [(s, idx), (idx, e)]
    return [p for p, k in zip(points, keep) if k]


def norm_name(n):
    n = n.lower().replace("’", "'")
    for junk in ("metro ", "stazione ", "staz. ", "fermata ", " m1", " m2", " m3", " m4", " m5", " (mm)", " mm"):
        n = n.replace(junk, " ")
    return " ".join(n.replace("-", " ").replace(".", " ").split())


UPPER_TOKENS = {"fs": "FS", "fn": "FN", "qt8": "QT8", "xxiii": "XXIII", "xxv": "XXV", "fs)": "FS)", "(fs)": "(FS)",
                "(h)": "(H)", "(ma)": "(MA)", "(mb)": "(MB)", "(mc)": "(MC)", "rai": "RAI", "eur": "EUR"}


def clean_name(n):
    """Display name: drop line suffixes ('Duomo M1 M3'), fix case and abbreviations."""
    words = title_case(n).split()
    while len(words) > 1 and (words[-1].upper() in {"M1", "M2", "M3", "M4", "M5", "MM"}):
        words.pop()
    out = []
    for w in words:
        lw = w.lower()
        if lw in UPPER_TOKENS:
            w = UPPER_TOKENS[lw]
        elif len(w) == 2 and w.endswith(".") or (len(w) > 1 and w[0].islower()):
            w = w[0].upper() + w[1:]
        elif "/" in w:
            w = "/".join(p[:1].upper() + p[1:] for p in w.split("/"))
        out.append(w)
    return " ".join(out).replace("P.ta ", "Porta ").replace("Staz.ne ", "Stazione ")


def title_case(n):
    if n.isupper() or n.islower():
        small = {"di", "de", "del", "della", "dei", "da", "e", "la", "le", "il", "a", "al", "in", "san"}
        words = n.lower().split()
        out = []
        for i, w in enumerate(words):
            out.append(w if (i and w in small and w != "san") else w[:1].upper() + w[1:])
        n = " ".join(out)
        n = n.replace("S.", "S. ").replace("  ", " ")
    return n.strip()


def gtfs_time(s):
    h, m, sec = (int(x) for x in s.strip().split(":"))
    return h * 3600 + m * 60 + sec


def read_csv(z, name):
    path = next((n for n in z.namelist() if n.split("/")[-1] == name), None)
    if not path:
        return
    with z.open(path) as f:
        yield from csv.DictReader(io.TextIOWrapper(f, "utf-8-sig", newline=""))


def busiest_weekday_services(z):
    """Return (date, set(service_id)) for the weekday with most active services."""
    active = defaultdict(set)
    weekday_cols = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    for r in read_csv(z, "calendar.txt") or []:
        try:
            start = dt.datetime.strptime(r["start_date"], "%Y%m%d").date()
            end = dt.datetime.strptime(r["end_date"], "%Y%m%d").date()
        except (KeyError, ValueError):
            continue
        end = min(end, start + dt.timedelta(days=120))
        d = start
        while d <= end:
            if r.get(weekday_cols[d.weekday()]) == "1":
                active[d].add(r["service_id"])
            d += dt.timedelta(days=1)
    for r in read_csv(z, "calendar_dates.txt") or []:
        try:
            d = dt.datetime.strptime(r["date"], "%Y%m%d").date()
        except (KeyError, ValueError):
            continue
        if r.get("exception_type") == "1":
            active[d].add(r["service_id"])
        elif r.get("exception_type") == "2":
            active[d].discard(r["service_id"])
    weekdays = {d: s for d, s in active.items() if d.weekday() < 5}
    if not weekdays:
        weekdays = active
    best = max(weekdays, key=lambda d: (len(weekdays[d]), d))
    return best, weekdays[best]


def build_city(key, cfg, zpath):
    z = zipfile.ZipFile(zpath)
    wanted = cfg["lines"]
    routes = {r["route_id"]: r for r in read_csv(z, "routes.txt") if r["route_id"] in wanted}
    missing = set(wanted) - set(routes)
    if missing:
        log(f"  [{key}] routes not in feed (skipped): {sorted(missing)}")

    day, services = busiest_weekday_services(z)
    log(f"  [{key}] reference weekday {day}, {len(services)} services")

    trips = {}
    for t in read_csv(z, "trips.txt"):
        if t["route_id"] in routes:
            trips[t["trip_id"]] = t

    stop_times = defaultdict(list)
    for st in read_csv(z, "stop_times.txt"):
        tid = st["trip_id"]
        if tid in trips:
            tm = st.get("departure_time") or st.get("arrival_time")
            if not tm:
                continue
            stop_times[tid].append((int(st["stop_sequence"]), st["stop_id"], gtfs_time(tm)))
    for v in stop_times.values():
        v.sort()

    used_stops = {s for v in stop_times.values() for _, s, _ in v}
    stops = {}
    for s in read_csv(z, "stops.txt"):
        stops[s["stop_id"]] = s

    def parent_of(stop_id):
        s = stops[stop_id]
        parent = s.get("parent_station") or ""
        return parent if parent and parent in stops else stop_id

    # merge platforms / per-direction stops that share a name and sit close
    # together into one station (many feeds publish one stop per direction)
    merged = {}
    clusters = defaultdict(list)  # normalised name -> [(rep_id, lat, lon)]
    for sid in sorted({parent_of(x) for x in used_stops}):
        s = stops[sid]
        la, lo = float(s["stop_lat"]), float(s["stop_lon"])
        nm = norm_name(s["stop_name"])
        for rep, rla, rlo in clusters[nm]:
            if haversine((la, lo), (rla, rlo)) <= MERGE_RADIUS:
                merged[sid] = rep
                break
        else:
            clusters[nm].append((sid, la, lo))
            merged[sid] = sid

    # second pass: stops of the same route within SAME_LINE_RADIUS are the two
    # platforms of one station even when the operator names them differently
    routes_at = defaultdict(set)
    for tid, sts in stop_times.items():
        for _, sid, _ in sts:
            routes_at[merged[parent_of(sid)]].add(trips[tid]["route_id"])
    uf = {k: k for k in routes_at}

    def find(x):
        while uf[x] != x:
            uf[x] = uf[uf[x]]
            x = uf[x]
        return x

    reps = sorted(routes_at)
    coords = {k: (float(stops[k]["stop_lat"]), float(stops[k]["stop_lon"])) for k in reps}
    for i, a in enumerate(reps):
        for b in reps[i + 1:]:
            if abs(coords[a][0] - coords[b][0]) > 0.002:
                continue
            if routes_at[a] & routes_at[b] and haversine(coords[a], coords[b]) <= SAME_LINE_RADIUS:
                # never merge two stops that are consecutive on a trip (real separate stops)
                uf[find(b)] = find(a)
    consecutive = set()
    for sts in stop_times.values():
        for (_, x, _), (_, y, _) in zip(sts, sts[1:]):
            consecutive.add(frozenset((merged[parent_of(x)], merged[parent_of(y)])))
    for k in reps:
        r = find(k)
        if r != k and frozenset((r, k)) in consecutive:
            uf[k] = k  # undo: they are neighbouring stops, not platforms
    for k in list(merged):
        if merged[k] in uf:
            merged[k] = find(merged[k])

    def station_of(stop_id):
        return merged[parent_of(stop_id)]

    # station ids, then merge same-name stations of the same line that sit close
    members = defaultdict(list)
    for sid in used_stops:
        members[station_of(sid)].append(stops[sid])
    stations = {}
    for st_id, ms in members.items():
        stations[st_id] = {
            "name": clean_name(stops[st_id]["stop_name"]),
            "lat": round(statistics.mean(float(m["stop_lat"]) for m in ms), 6),
            "lon": round(statistics.mean(float(m["stop_lon"]) for m in ms), 6),
        }

    shapes_needed = {t.get("shape_id") for t in trips.values() if t.get("shape_id")}
    shapes = defaultdict(list)
    if shapes_needed:
        for p in read_csv(z, "shapes.txt") or []:
            if p["shape_id"] in shapes_needed:
                shapes[p["shape_id"]].append((int(p["shape_pt_sequence"]), float(p["shape_pt_lat"]), float(p["shape_pt_lon"])))

    lines = []
    for rid, r in routes.items():
        code, mode, colour = wanted[rid]
        colour = colour or (r.get("route_color") or "").strip().upper() or cfg.get("tram_colour") or "555555"
        if colour in ("FFFFFF", "NONE"):
            colour = cfg.get("tram_colour", "555555")
        # patterns at station level
        pat_count = Counter()
        pat_trips = defaultdict(list)
        for tid, t in trips.items():
            if t["route_id"] != rid or len(stop_times[tid]) < 2:
                continue
            seq = []
            for _, sid, _ in stop_times[tid]:
                stn = station_of(sid)
                if not seq or seq[-1] != stn:
                    seq.append(stn)
            key_seq = tuple(seq)
            pat_count[key_seq] += 1
            pat_trips[key_seq].append(tid)
        if not pat_count:
            log(f"  [{key}] {code}: no trips")
            continue
        # canonical direction: merge reversed patterns
        canon = Counter()
        canon_trips = defaultdict(list)
        for p, c in pat_count.items():
            rp = p[::-1]
            k = p if p in canon or rp not in canon else rp
            if rp in canon and p not in canon:
                k = rp
            canon[k] += c
            canon_trips[k] += pat_trips[p]
        top = canon.most_common()
        maxc = top[0][1]

        def contained(small, big):
            n = len(small)
            for seq in (big, big[::-1]):
                for i in range(len(seq) - n + 1):
                    if seq[i:i + n] == small:
                        return True
            return False

        branches = []
        for p, c in sorted(top, key=lambda x: (-len(x[0]), -x[1])):
            if c < max(3, 0.08 * maxc):
                continue
            if any(contained(p, b) for b in branches):
                continue
            branches.append(p)
        branches.sort(key=lambda b: -canon[b])

        # orient branches consistently: share the same first station where possible
        if len(branches) > 1:
            ref = branches[0]
            for i, b in enumerate(branches[1:], 1):
                if b[-1] == ref[0] or b[-1] == ref[-1] and b[0] != ref[0]:
                    branches[i] = b[::-1]

        # run times between consecutive stations (median over all trips)
        seg = defaultdict(list)
        for tid in (t for t in trips if trips[t]["route_id"] == rid):
            prev = None
            for _, sid, tm in stop_times[tid]:
                stn = station_of(sid)
                if prev and prev[0] != stn and tm >= prev[1]:
                    seg[frozenset((prev[0], stn))].append(tm - prev[1])
                prev = (stn, tm)
        runtime = {k: max(30, int(statistics.median(v))) for k, v in seg.items()}

        # headways per band on the reference weekday, from first-stop departures (one direction)
        # count trips of one direction passing the middle station of the main
        # branch (works for feeds without direction_id and for branched lines)
        main = branches[0]
        pos = {stn: i for i, stn in enumerate(main)}
        probe = main[len(main) // 2]
        dir_deps = []
        for tid, t in trips.items():
            if t["route_id"] != rid or t["service_id"] not in services:
                continue
            seq = [(station_of(sid), tm) for _, sid, tm in stop_times[tid]]
            idx = [pos[stn] for stn, _ in seq if stn in pos]
            if len(idx) < 2 or idx[-1] < idx[0]:
                continue
            tm = next((tm for stn, tm in seq if stn == probe), None)
            if tm is None:  # short-turn trip that misses the probe: use its first stop
                if pos.get(seq[0][0], 0) > pos[probe] or pos.get(seq[-1][0], len(main)) < pos[probe]:
                    continue
                tm = seq[0][1]
            dir_deps.append(tm)
        headways = []
        for a, b in TIME_BANDS:
            n = sum(1 for x in dir_deps if a * 3600 <= x % 86400 < b * 3600)
            headways.append(round((b - a) * 60 / n, 1) if n else None)
        first = min(dir_deps) if dir_deps else None
        last = max(dir_deps) if dir_deps else None

        # shape: longest shape of the main branch's trips
        shape = []
        cand = [trips[t].get("shape_id") for t in canon_trips[branches[0]] if trips[t].get("shape_id") in shapes]
        if cand:
            sid = Counter(cand).most_common(1)[0][0]
            pts = [(la, lo) for _, la, lo in sorted(shapes[sid])]
            shape = [[round(la, 5), round(lo, 5)] for la, lo in rdp(pts, 12)]

        lines.append({
            "id": f"{key}:{code}",
            "code": code,
            "mode": mode,
            "color": colour,
            "gtfsRouteId": rid,
            "branches": [list(b) for b in branches],
            "runtime": [[a, b, runtime.get(frozenset((a, b)), 120)]
                        for br in branches for a, b in zip(br, br[1:])],
            "headways": headways,
            "firstDep": first,
            "lastDep": last,
            "shape": shape,
            "tripsPerDay": len(dir_deps),
        })
        log(f"  [{key}] {code:>6} {mode:<9} {len(branches)} branch(es), "
            f"{sum(len(b) for b in branches)} stops, {len(dir_deps)} trips/dir/day")

    # keep only stations used by kept lines; prefix ids with the city
    used = {s for ln in lines for b in ln["branches"] for s in b}
    st_out = {f"{key}:{s}": {**stations[s], "lines": []} for s in used}
    for ln in lines:
        ln["branches"] = [[f"{key}:{s}" for s in b] for b in ln["branches"]]
        ln["runtime"] = [[f"{key}:{a}", f"{key}:{b}", t] for a, b, t in ln["runtime"]]
        for b in ln["branches"]:
            for s in b:
                if ln["id"] not in st_out[s]["lines"]:
                    st_out[s]["lines"].append(ln["id"])

    # dedupe runtime triples
    for ln in lines:
        seen, rt = set(), []
        for a, b, t in ln["runtime"]:
            if (a, b) not in seen:
                seen.add((a, b))
                rt.append([a, b, t])
        ln["runtime"] = rt

    # interchanges: stations of different lines close by
    ids = sorted(st_out)
    transfers = []
    for i, a in enumerate(ids):
        for b in ids[i + 1:]:
            sa, sb = st_out[a], st_out[b]
            if set(sa["lines"]) == set(sb["lines"]):
                continue
            d = haversine((sa["lat"], sa["lon"]), (sb["lat"], sb["lon"]))
            same = norm_name(sa["name"]) == norm_name(sb["name"])
            if d <= TRANSFER_RADIUS or (same and d <= SAME_NAME_RADIUS):
                transfers.append([a, b, int(d), int(60 + d * 1.3 / WALK_SPEED)])

    lines.sort(key=lambda l: (MODE_ORDER[l["mode"]], len(l["code"]), l["code"]))
    city = {
        "id": key,
        "name": cfg["name"],
        "operator": cfg["operator"],
        "source": {"mdbId": cfg["mdb_id"], "url": MDB.format(cfg["file"]),
                   "license": cfg["license"], "licenseUrl": cfg["license_url"],
                   "referenceDay": day.isoformat()},
        "center": [round(statistics.mean(s["lat"] for s in st_out.values()), 5),
                   round(statistics.mean(s["lon"] for s in st_out.values()), 5)],
    }
    return city, lines, st_out, transfers


def download(cfg, cache):
    path = os.path.join(cache, cfg["file"])
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return path
    url = MDB.format(cfg["file"])
    log(f"  downloading {url}")
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=600) as r, open(path + ".part", "wb") as f:
        while chunk := r.read(1 << 20):
            f.write(chunk)
    os.replace(path + ".part", path)
    return path


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    root = os.path.abspath(os.path.join(here, "..", ".."))
    ap = argparse.ArgumentParser()
    ap.add_argument("--cache", default=os.path.join(here, ".cache"))
    ap.add_argument("--out", default=os.path.join(root, "assets", "data", "network.json"))
    ap.add_argument("--only", default="")
    args = ap.parse_args()
    os.makedirs(args.cache, exist_ok=True)
    only = {c for c in args.only.split(",") if c}

    out = {"version": 1, "generated": dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
           "timeBands": TIME_BANDS, "cities": [], "lines": [], "stations": {}, "transfers": []}
    for key, cfg in CITIES.items():
        if only and key not in only:
            continue
        log(f"[{key}]")
        city, lines, stations, transfers = build_city(key, cfg, download(cfg, args.cache))
        out["cities"].append(city)
        out["lines"] += lines
        out["stations"].update(stations)
        out["transfers"] += transfers

    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    log(f"wrote {args.out}: {len(out['lines'])} lines, {len(out['stations'])} stations, "
        f"{len(out['transfers'])} interchanges, {os.path.getsize(args.out) // 1024} KiB")


if __name__ == "__main__":
    main()
