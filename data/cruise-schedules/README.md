# Norway master cruise schedule data

Norway Shore Excursions is the central schedule database for Norwegian cruise ports.

## Supported raw CSV filenames

Place approved schedule files in `raw/`:

- `flam-cruise-schedule-2026.csv`
- `bergen-cruise-schedule-2026.csv`
- `stavanger-cruise-schedule-2026.csv`
- `eidfjord-cruise-schedule-2026.csv`
- `olden-cruise-schedule-2026.csv`
- `geiranger-cruise-schedule-2026.csv`
- `nordfjordeid-cruise-schedule-2026.csv`

Monthly splits such as `flam-cruise-schedule-july-2026.csv` are also supported.

## CSV format

```csv
date,ship,arrival,departure,cruiseline
2026-06-01,Spirit Of Adventure,10:00,19:00,Saga
```

Port is inferred from the filename. Passenger counts are enriched from `ship-capacities.csv` when missing.

## Generated outputs

After `npm run import:schedules`:

- `data/cruise-schedules/{port}-2026.csv` — cleaned master CSV per port
- `public/data/cruise-schedules/{port}-2026.json` — public JSON per port
- `src/data/cruise-schedules.generated.json` — app bundle for `getSchedulesByPort()` and related helpers

## Reuse on port sites

Future port sites (for example flamshoreexcursions.com) can import the same helpers from this project or consume the generated JSON files.

Sample schedule data must never be used on live production schedule pages.
