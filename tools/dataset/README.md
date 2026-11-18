# Offline network dataset

`build_offline_dataset.py` builds `assets/data/network.json`, the rail network bundled with ItaliaNow
for offline routing. It reads the operators' official GTFS feeds through the Mobility Database
mirror (`storage.googleapis.com/mdb-latest`), keeps the metro, tram, funicular and suburban rail
routes listed in `CITIES`, and derives:

- ordered station lists for every branch, with per-direction platforms merged into one station
- median run times between stations, from `stop_times.txt`
- weekday headways per time band and first/last departures, from the busiest weekday in the calendar
- simplified line shapes (Douglas-Peucker, 12 m)
- walking interchanges between stations of different lines (250 m, or 500 m for the same name)

The only hand-written values are line colours where the GTFS colour is missing or unreadable.

## Re-run

```sh
python3 tools/dataset/build_offline_dataset.py               # downloads feeds into tools/dataset/.cache
python3 tools/dataset/build_offline_dataset.py --only milan  # one city
```

Python 3.9+ with the standard library only. A full run downloads about 130 MB and takes under a minute.

| City | Operator | Mobility Database ID |
|---|---|---|
| Roma | ATAC / Roma Servizi per la Mobilità | mdb-1294 |
| Milano | ATM | mdb-2666 |
| Napoli | ANM | mdb-893 |
| Torino | GTT | mdb-2687 |
| Genova | AMT | mdb-2610 |
| Catania | FCE | mdb-3124 |

Brescia Mobilità and EAV are not yet in the Mobility Database mirror; they are next.
