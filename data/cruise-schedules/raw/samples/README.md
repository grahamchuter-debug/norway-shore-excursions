Sample schedule CSV files for development only. These files are **not imported**.

Add real approved schedule data as top-level files in `data/cruise-schedules/raw/`, using the same naming as Flåm:

```
flam-cruise-schedule-2026.csv          (June, or full year in one file)
flam-cruise-schedule-july-2026.csv
flam-cruise-schedule-august-2026.csv
flam-cruise-schedule-september-2026.csv

bergen-cruise-schedule-2026.csv
bergen-cruise-schedule-july-2026.csv
…

olden-cruise-schedule-2026.csv
…

nordfjordeid-cruise-schedule-2026.csv
…
```

**Do not** add `{port}-2026.csv` files to the raw folder. Those legacy sample filenames are ignored and must never appear on live schedule pages.

Sample data must never be used on live production schedule pages.

Manual CSV columns:

```
date,ship,arrival,departure,cruiseline
2026-06-01,Spirit Of Adventure,10:00,19:00,Saga
```

Use `tbc` or leave blank for unknown times. Port is inferred from the filename.

Then run:

```bash
npm run import:schedules
```

Verify counts:

```bash
npm run debug:schedules -- bergen 2026 7
```
