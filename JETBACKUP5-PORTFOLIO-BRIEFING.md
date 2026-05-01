# JetBackup 5 Automated Monitoring & Remediation System
## Portfolio Achievement Briefing

---

## Project Summary

A fully automated, closed-loop backup monitoring and self-healing system built on the **LOPA stack** (Loki + OpenTelemetry + Prometheus + Ansible). The system monitors JetBackup 5 across a fleet of **5+ cPanel hosting servers** (expandable to 19), detects failed, partial, and never-finished backup jobs, automatically retries them without human intervention, and publishes a live dashboard to Google Sheets — all triggered by event-driven automation running 24/7.

This is not a monitoring script. It is a production-grade, event-driven remediation pipeline that closes the loop between detection and fix.

---

## The Problem It Solves

In high-density shared hosting environments, JetBackup 5 runs nightly backup jobs for hundreds of cPanel accounts per server. Several failure modes occur silently:

- **Partial DB backups** — MySQL connection pool exhaustion causes `mysqldump` to fail mid-backup. JetBackup marks the account as "partially completed" but takes no corrective action.
- **Never-finished accounts** — The backup job is killed (server load, timeout) before all accounts complete. Affected accounts have no new backup but no alert is raised.
- **Missed backups** — An account's last backup predates the most recent scheduled run window, meaning it silently missed a cycle.
- **Unreliable suspended-account detection** — JetBackup's own `suspended` field returns `false` for actually-suspended accounts, causing false positives in problem reports.

Without this system, these failures go unnoticed until a customer requests a restore and discovers their backup is stale, partial, or missing.

---

## Architecture Overview

```
LOPA Hub (65.108.5.105)
│
├── Ansible EDA (lopa-eda.service)
│     └── ansible.eda.tick → every 3600s
│           └── jetbackup5-eda-check.yml
│                 ├── Time window gate: 21:00–05:00 PKT only
│                 ├── SSH each server → getDashboardDetails API
│                 ├── Detect: did a target job finish in last 60 min?
│                 ├── Cooldown check: 55-min dedup window
│                 └── ansible-playbook jetbackup5-monitor.yml --limit <server>
│
└── jetbackup5-monitor.yml (3-play pipeline)
      ├── Play 1 — Fetch
      │     ├── JetBackup API calls (dashboard, accounts, pagination)
      │     ├── whmapi1 suspended account list (authoritative source)
      │     ├── Multi-threaded queue log parser (per-PID state tracking)
      │     ├── jb5_process.py — schedule-aware status classification
      │     └── data.json saved to LOPA hub
      │
      ├── Play 2 — Retry
      │     ├── jetbackup5-retry.sh deployed to each cPanel server
      │     ├── Creates temp account filter + temp backup job via API
      │     ├── Triggers targeted retry for failed accounts only
      │     ├── Polls job completion every 120s (up to 4h timeout)
      │     ├── Up to 2 retry attempts with 60s pause between
      │     └── retry-result.json fetched back to LOPA hub
      │
      └── Play 3 — Report
            ├── Merges retry results into data.json
            └── jetbackup5-sheets-update.py → Google Sheets (5 tabs)
```

---

## Technical Depth

### Event-Driven Trigger (Ansible EDA)

The system runs inside an existing `lopa-eda.service` as a second ruleset, sharing the service with the LiteSpeed 503 remediation system. It uses `ansible.eda.tick` (not `ansible.eda.schedule`, which is not installed in this EDA version) with a 55-minute throttle to prevent double-firing within the same hour.

The trigger is **event-driven, not time-driven**: it only fires the full pipeline when a target backup job actually completed in the last 60 minutes. This avoids unnecessary SSH connections and API calls during hours when no backups ran.

Target jobs monitored: `cpanel-r1soft`, `cpanel-weekly-r1soft`, `cpanel-wasabi`, `cpanel-weekly-wasabi`, `mysql-r1soft`, `mysql-daily-r1soft`.

### Multi-Threaded Log Parser

JetBackup 5 runs account backups in parallel threads. Queue log files at `/usr/local/jetapps/var/log/jetbackup5/queue/1_*.log` have interleaved lines from multiple PIDs. A naive sequential parser would misattribute errors to the wrong accounts.

The parser tracks state **per PID**:

```python
pid_state[pid] = {
    "account":    "username",
    "has_error":  False,   # set on [ERROR] line
    "is_partial": False,   # set on "Backup Partially Completed"
    "completed":  False,   # set on "Executing post account backup hook"
}
```

After parsing all lines, accounts are classified:
- `is_partial=True` → `PARTIAL_DB`
- `has_error=True, is_partial=False` → `DB_ERROR`
- `completed=False, job_not_finished` → `NEVER_FINISHED`

A second pass across all recent log files builds a `completed_users` set to clear false positives — accounts that failed in one run but succeeded in a later run are not reported as problems.

### Schedule-Aware Stale Detection

Rather than using a fixed age threshold, the processor uses `backup-schedules.json` to determine the most recent scheduled run time for each server (19 servers, each with independent cPanel and MySQL backup schedules in PKT timezone). An account is classified as `MISSED` only if its last backup predates the most recent scheduled run window minus a 4-hour grace period for long-running jobs.

```python
def last_scheduled_epoch(days, time_str):
    # Walks back 14 days to find most recent scheduled run
    # Converts PKT local time to UTC for epoch comparison
    # Returns epoch of that run
```

This eliminates false "stale" alerts on servers that run weekly backups — an account backed up 6 days ago on a weekly schedule is `OK`, not `STALE`.

### Targeted Retry via JetBackup API

The retry system does not re-run the entire backup job (which would back up all 150–200 accounts). Instead it:

1. Creates a temporary **account filter** (`manageAccountFilter`) containing only the failed accounts
2. Creates a temporary **backup job** (`manageBackupJob`) attached to that filter
3. Triggers it via `runBackupJobManually`
4. Polls `getBackupJob` every 120 seconds until `running=False`
5. Parses the result log to identify still-failing accounts
6. Cleans up the temp job and filter (`deleteBackupJob`, `deleteAccountFilter`)
7. If failures remain, waits 60 seconds and repeats (up to 2 attempts)

Temp jobs are named `jb5-retry-cpanel-{epoch}` and `jb5-retry-mysql-{epoch}`. JetBackup creates alerts for these jobs, which are filtered out in the data processor to prevent noise in the dashboard.

### Suspended Account Handling

JetBackup's `account_data.suspended` field is unreliable — it returns `false` for accounts that are actually suspended in cPanel. The system uses `whmapi1 listsuspended` as the authoritative source at both fetch time (for classification) and retry time (to avoid retrying suspended accounts).

### Google Sheets Dashboard (5 Tabs)

The `jetbackup5-sheets-update.py` script uses the Google Sheets API v4 with a service account. It implements a **search-and-update** strategy rather than a full rewrite: it finds existing rows by `(Server, Username)` key and updates them in place, appending only new rows. This preserves historical data when a server goes offline.

| Tab | Content |
|-----|---------|
| Fleet Summary | One row per server: account health, job status, queue, alerts, disk usage |
| Backup Jobs | Per-job schedule, last/next run, hours since run, overdue flag |
| Problem Accounts | All accounts with issues, color-coded by severity |
| Alerts | Active JetBackup alerts (retry-job alerts filtered out) |
| Retry History | Per-account retry outcomes with attempt count and timestamp |

Color coding: Red = critical (NO_BACKUP, DAMAGED, NEVER_FINISHED), Orange = partial/disabled, Yellow = stale/missed, Green = OK/fixed.

---

## Key Engineering Decisions & Lessons Learned

**MySQL backup API is blocked.** `jetbackup5api -F listBackupForAccounts -D "contains=132"` returns "no permissions" even as root. MySQL backup health is tracked at job level only via queue history from `getDashboardDetails`.

**`backup_contains` field is not a bitmask.** The `backup_contains=1` field in `listBackupForAccounts` responses is a job type identifier, not a component bitmask. Partial backup detection must use log file parsing, not API fields.

**`ansible.eda.schedule` is not installed.** The EDA environment uses `ansible.eda.tick` with `delay: 3600` instead. The `throttle` directive requires `group_by_attributes` in this version of ansible-rulebook — `once_within` alone causes a validation error.

**Jinja2 templating inside Python heredocs.** Passing JSON via `{{ variable | to_json }}` inside Ansible Python heredocs causes template corruption. The solution is to write API responses to temp files first, then read them in Python.

**MySQL `max_connections` root cause.** The real cause of partial backups on pcp1 was `max_connections=150` with JetBackup running 30 parallel threads, each needing multiple connections for `mysqldump`. Peak usage hit 126/150. Fix: `SET GLOBAL max_connections = 300` + persist in `/etc/my.cnf`.

**Cooldown state files.** Each server has a `.last_trigger` state file at `/opt/lopa-eda/logs/eda/state/{hostname}.last_trigger` storing the last trigger epoch. This prevents the hourly EDA tick from re-triggering the pipeline for the same backup job completion event.

---

## Scale & Impact

| Metric | Value |
|--------|-------|
| Servers monitored | 5 active (19 configured in schedules) |
| Accounts per server | 150–200 cPanel accounts |
| Backup jobs tracked | 5–6 per server (cPanel weekly, MySQL daily, Wasabi, R1Soft) |
| Retry success rate | Confirmed: PARTIAL_DB accounts fixed on attempt 1 in testing |
| Pipeline runtime | ~10–15 min per server (fetch + retry + sheet) |
| Automation window | 21:00–05:00 PKT (8 hours nightly) |
| Google Sheet tabs | 5 (Fleet Summary, Jobs, Problem Accounts, Alerts, Retry History) |
| Log retention | 30 days, 50MB rotation |

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Orchestration | Ansible 2.x + Ansible EDA (ansible-rulebook 2.11.0) |
| Event source | `ansible.eda.tick` (hourly polling) |
| Data collection | JetBackup 5 CLI API (`jetbackup5api`), WHM API (`whmapi1`) |
| Log parsing | Python 3 (per-PID state machine, regex) |
| Data processing | Python 3 (`jb5_process.py` — schedule-aware classification) |
| Reporting | Python 3.12 + Google Sheets API v4 (`google-auth`, `googleapiclient`) |
| Infrastructure | LOPA Hub (Loki 3.0, Prometheus, Grafana, Nginx) |
| Monitoring | Prometheus metrics + Loki log streams (`service_name="jetbackup5"`) |
| Deployment | SSH-based Ansible playbooks, systemd service |

---

## Files Produced

| File | Purpose |
|------|---------|
| `jetbackup5-monitor.yml` | Main 3-play pipeline (fetch + retry + sheet) |
| `jetbackup5-fetch.yml` | Fetch-only playbook for manual use |
| `jetbackup5-retry.yml` | Retry-only playbook for manual use |
| `jetbackup5-scheduler.yml` | Standalone scheduler (cron alternative) |
| `jetbackup5-eda-check.yml` | EDA-triggered check with time window + cooldown |
| `jb5_process.py` | Data processor — API JSON → classified data.json |
| `jetbackup5-sheets-update.py` | Google Sheets updater (5 tabs, search-and-update) |
| `jetbackup5-retry.sh` | Bash retry script deployed to each cPanel server |
| `backup-schedules.json` | Per-server backup schedule config (19 servers) |
| `eda-rulebooks/jetbackup5-monitor-rulebook.yml` | EDA rulebook definition |

---

## What Makes This Project Stand Out

1. **Closed-loop automation** — The system detects a problem and fixes it without human intervention, then reports the outcome. It is not just an alerting system.

2. **Production-hardened edge cases** — Every known failure mode of the JetBackup API, EDA version quirks, MySQL connection limits, and log format ambiguities is documented and handled in code.

3. **Non-destructive retry** — The retry system creates temporary jobs targeting only failed accounts, leaving the production backup schedule untouched. Cleanup is guaranteed even on failure.

4. **Schedule-aware intelligence** — The system understands each server's backup schedule and uses it to distinguish a genuinely missed backup from an account that simply hasn't been backed up yet this week.

5. **Multi-system integration** — Combines Ansible EDA, JetBackup CLI API, WHM API, multi-threaded log parsing, and Google Sheets API into a single coherent pipeline running as a systemd service.

---

*Built as part of the LOPA (Loki + OpenTelemetry + Prometheus + Ansible) closed-loop observability and remediation stack for high-density cPanel hosting environments.*
