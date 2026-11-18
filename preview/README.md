# ItaliaNow live web preview

A no-build web version of ItaliaNow that runs fully online in the browser:

- asks for location on first launch, then opens on **Nearby departures** (live Transitous data, refreshed every 30 s)
- real vector map (MapLibre GL; CARTO Positron / Dark Matter, or MapTiler when `MAPTILER_KEY` is set in `config.js`)
- live address and stop search, live door-to-door journeys with delays, cancellations, platforms and strike alerts
- automatic fallback to the bundled GTFS metro/tram network with an "Offline" badge when the API can't be reached

Run locally: `cd preview && python3 -m http.server 8080`, then open http://localhost:8080
(location needs `localhost` or HTTPS).

Published at https://arafin-sketch.github.io/GoItalia/ from the `gh-pages` branch.

Configuration lives in `config.js` (`API_BASE` can point to your own MOTIS server).
`data/network.json` is a copy of `assets/data/network.json`, built by `tools/dataset/build_offline_dataset.py`.
