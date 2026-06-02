#!/usr/bin/env bash
# One-off batch: fetch CruiseTimetables monthly schedules with delays between months.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
LOG="$ROOT/data/cruise-schedules/raw/fetch-log-$(date +%Y%m%d).txt"
DELAY_BETWEEN_MONTHS="${DELAY_BETWEEN_MONTHS:-120}"

log() { echo "[$(date -Iseconds)] $*" | tee -a "$LOG"; }

fetch_month() {
  local slug="$1" month="$2" outfile="$3"
  local url="https://www.cruisetimetables.com/${slug}-${month}2026.html"
  log "START $slug $month -> $outfile"
  if node scripts/parse-cruisetimetables-schedule.js "$url" "data/cruise-schedules/raw/$outfile" 2>&1 | tee -a "$LOG"; then
    log "DONE $slug $month"
  else
    log "FAIL $slug $month"
    return 1
  fi
  log "Sleep ${DELAY_BETWEEN_MONTHS}s before next month..."
  sleep "$DELAY_BETWEEN_MONTHS"
}

run_port() {
  local slug="$1" prefix="$2"
  for spec in "jun:${prefix}-cruise-schedule-2026.csv" \
              "jul:${prefix}-cruise-schedule-july-2026.csv" \
              "aug:${prefix}-cruise-schedule-august-2026.csv" \
              "sep:${prefix}-cruise-schedule-september-2026.csv"; do
    local month="${spec%%:*}"
    local file="${spec##*:}"
    fetch_month "$slug" "$month" "$file"
  done
}

: > "$LOG"
log "Batch fetch started (delay=${DELAY_BETWEEN_MONTHS}s)"

port_slug() {
  case "$1" in
    alesund) echo visitingalesundnorway ;;
    molde) echo visitingmoldenorway ;;
    hellesylt) echo visitinghellesyltnorway ;;
    trondheim) echo visitingtrondheimnorway ;;
    tromso) echo visitingtromsonorway ;;
    honningsvag) echo visitinghonningsvagnorway ;;
    kristiansand) echo visitingkristiansandnorway ;;
    *) echo "Unknown port: $1" >&2; return 1 ;;
  esac
}

if [[ -n "${PORTS:-}" ]]; then
  for p in $PORTS; do
    run_port "$(port_slug "$p")" "$p"
  done
else
  for p in trondheim tromso honningsvag kristiansand alesund molde hellesylt; do
    run_port "$(port_slug "$p")" "$p"
  done
fi

log "Batch fetch complete"
