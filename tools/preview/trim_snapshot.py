import json, sys
d = json.load(open(sys.argv[1]))
def place(p):
    if not p: return None
    o = {k: p.get(k) for k in ("name", "lat", "lon", "track", "scheduledTrack") if p.get(k) is not None}
    o["lat"] = round(o["lat"], 6); o["lon"] = round(o["lon"], 6)
    return o
def alerts(a):
    out = []
    for x in a or []:
        h = x.get("headerText") or ""
        if h and h not in [y["h"] for y in out]:
            out.append({"h": h, "d": (x.get("descriptionText") or "")[:400], "cause": x.get("cause"),
                        "start": (x.get("impactPeriod") or [{}])[0].get("start")})
    return out[:3]
plans = {}
for k, p in d["plans"].items():
    its = []
    for it in (p or {}).get("itineraries", []):
        legs = []
        for l in it["legs"]:
            g = l.get("legGeometry") or {}
            legs.append({
                "mode": l["mode"], "from": place(l["from"]), "to": place(l["to"]),
                "start": l["startTime"], "end": l["endTime"],
                "sStart": l.get("scheduledStartTime"), "sEnd": l.get("scheduledEndTime"),
                "rt": l.get("realTime", False), "dist": round(l.get("distance") or 0),
                "dur": l.get("duration"), "head": l.get("headsign"),
                "name": l.get("displayName") or l.get("routeShortName"), "color": l.get("routeColor"),
                "text": l.get("routeTextColor"), "agency": l.get("agencyName"),
                "stops": [s["name"] for s in l.get("intermediateStops") or []],
                "geom": g.get("points"), "prec": g.get("precision"), "cancelled": l.get("cancelled", False),
                "alerts": alerts(l.get("alerts")),
            })
        its.append({"start": it["startTime"], "end": it["endTime"], "dur": it["duration"], "transfers": it["transfers"], "legs": legs})
    plans[k] = its
stops = {}
for k, lst in d["stops"].items():
    out = []
    for s in lst:
        sts = []
        for x in s["stopTimes"]:
            p = x["place"]
            sts.append({"dep": p.get("departure") or p.get("arrival"), "sDep": p.get("scheduledDeparture") or p.get("scheduledArrival"),
                        "rt": x.get("realTime", False), "cancelled": p.get("cancelled", False) or x.get("cancelled", False),
                        "track": p.get("track"), "mode": x.get("mode"), "head": x.get("headsign"),
                        "name": x.get("displayName") or x.get("routeShortName"), "color": x.get("routeColor"),
                        "text": x.get("routeTextColor"), "agency": x.get("agencyName"), "alerts": alerts(p.get("alerts") or x.get("alerts"))})
        st = s["stop"]
        out.append({"name": st["name"], "lat": round(st["lat"], 6), "lon": round(st["lon"], 6), "distance": st["distance"], "times": sts})
    stops[k] = out
geo = {}
for q, res in d["geocode"].items():
    geo[q] = [{"name": r["name"], "type": r["type"], "lat": round(r["lat"], 6), "lon": round(r["lon"], 6),
               "area": next((a["name"] for a in r.get("areas", []) if a.get("default")), ""),
               "street": r.get("street"), "num": r.get("houseNumber")} for r in (res or [])[:8]]
json.dump({"captured": d["captured"], "places": d["places"], "plans": plans, "stops": stops, "geocode": geo},
          open(sys.argv[2], "w"), ensure_ascii=False, separators=(",", ":"))
