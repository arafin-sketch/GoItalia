# Data preview

A single HTML page that previews the app on real data before the Flutter build.

```sh
python3 tools/preview/capture_transitous.py out/live.json        # records Transitous responses (rate-limited)
python3 tools/preview/trim_snapshot.py out/live.json out/live.min.json
python3 tools/preview/inline.py tools/preview/template.html assets/data/network.json out/live.min.json out/preview.html
```
