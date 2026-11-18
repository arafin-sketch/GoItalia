import json, time, urllib.request, urllib.parse, sys, datetime as dt
UA = "ItaliaNow/0.1 (preview build; https://github.com/arafin-sketch/GoItalia)"
B = "https://api.transitous.org/api"
def get(path, **q):
    url = f"{B}{path}?{urllib.parse.urlencode(q)}"
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                time.sleep(1.2)  # stay well inside the rate limit
                return json.load(r)
        except Exception as e:
            print("retry", path, e, file=sys.stderr); time.sleep(2 ** attempt)
    return None
P = {
 "termini": ("Roma Termini", 41.9010, 12.5016), "colosseo": ("Colosseo", 41.8902, 12.4922),
 "fiumicino": ("Fiumicino Aeroporto", 41.7930, 12.2527), "vaticano": ("Musei Vaticani", 41.9065, 12.4536),
 "mi_centrale": ("Milano Centrale", 45.4861, 9.2046), "duomo": ("Duomo di Milano", 45.4642, 9.1900),
 "navigli": ("Navigli – Porta Genova", 45.4527, 9.1700),
 "na_centrale": ("Napoli Centrale", 40.8527, 14.2726), "pompei": ("Pompei Scavi", 40.7490, 14.4840),
 "to_pn": ("Torino Porta Nuova", 45.0619, 7.6785), "lingotto": ("Lingotto", 45.0300, 7.6620),
}
journeys = [("termini","colosseo"),("fiumicino","termini"),("vaticano","colosseo"),("mi_centrale","duomo"),
            ("duomo","navigli"),("na_centrale","pompei"),("to_pn","lingotto"),("termini","mi_centrale")]
out = {"captured": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"), "places": P, "plans": {}, "stops": {}, "geocode": {}}
for a, b in journeys:
    r = get("/v5/plan", fromPlace=f"{P[a][1]},{P[a][2]}", toPlace=f"{P[b][1]},{P[b][2]}", numItineraries=5)
    out["plans"][f"{a}>{b}"] = r
    print(a, b, len((r or {}).get("itineraries", [])), file=sys.stderr)
for k in ("termini", "colosseo", "duomo", "mi_centrale", "na_centrale", "to_pn"):
    _, la, lo = P[k]; d = 0.0045  # ~500 m
    stops = get("/v1/map/stops", min=f"{la-d},{lo-d}", max=f"{la+d},{lo+d}") or []
    # keep parents / unique names, nearest first
    import math
    def dist(s): return math.hypot((s["lat"]-la)*111320, (s["lon"]-lo)*111320*math.cos(math.radians(la)))
    seen, picked = set(), []
    for s in sorted(stops, key=dist):
        if dist(s) > 500: continue
        key = s["name"].lower()
        if key in seen: continue
        seen.add(key); picked.append({**s, "distance": round(dist(s))})
    deps = []
    for s in picked[:5]:
        st = get("/v1/stoptimes", stopId=s.get("parentId") or s["stopId"], n=6)
        deps.append({"stop": s, "stopTimes": (st or {}).get("stopTimes", [])})
    out["stops"][k] = deps
    print(k, len(stops), [d["stop"]["name"] for d in deps], file=sys.stderr)
for q in ("Termini", "Colosseo", "Duomo Milano", "Piazza Garibaldi Napoli", "Porta Nuova Torino", "Brignole", "Via del Corso Roma"):
    out["geocode"][q] = get("/v1/geocode", text=q, language="en")
json.dump(out, open(sys.argv[1], "w"), ensure_ascii=False)
