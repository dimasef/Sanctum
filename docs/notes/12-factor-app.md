# The Twelve-Factor App — quick reference

A methodology for building cloud-native, scalable, portable web apps
(originally by Heroku, 2011). Stack-agnostic. Core idea: the app is **stateless**,
configured from the environment, and behaves identically in every environment.

## The 12 factors

| # | Factor | Essence | In Sanctum |
|---|---|---|---|
| 1 | Codebase | One repo, many deploys | our git repo |
| 2 | Dependencies | Explicitly declared & isolated | `package.json` + lockfile |
| 3 | **Config** | Config in **environment variables**, not code | `.env` + `src/config.ts` |
| 4 | Backing services | DB, cache, S3 are attachable resources via URL | `DATABASE_URL`, later S3 |
| 5 | Build, release, run | Three strictly separated stages | CI/CD (stage 9) |
| 6 | **Processes** | App is **stateless**; no in-memory state between requests | stateless access JWT |
| 7 | Port binding | App self-exposes via a port | `app.listen(port)` |
| 8 | Concurrency | Scale out by running **more processes** | multiple instances behind LB |
| 9 | Disposability | Fast startup/shutdown, graceful stop | added at deploy |
| 10 | Dev/prod parity | Keep environments as similar as possible | Docker Postgres ≈ RDS |
| 11 | Logs | Logs are an event **stream to stdout**, not files | `console.log` → platform |
| 12 | Admin processes | One-off tasks as separate processes | `prisma migrate`, seed |

## The three asked most in interviews

### Factor 3 — Config in the environment
The **same build** runs in dev/staging/prod, differing only by env vars. Secrets and
`DATABASE_URL` live in env, never hardcoded. Litmus test: *could you open-source the
code without leaking secrets?* If yes, config is externalized correctly.
Implemented here in `src/config.ts` (with fail-fast validation).

### Factor 6 — Stateless processes
No state kept in process memory between requests (no in-RAM sessions, no files on the
instance disk). Reason: with N instances behind a load balancer, the next request may
hit a different instance that must "remember" nothing. State goes to DB / cache / S3.

Connection to our auth: the **access token is stateless** (verified by signature, no DB
lookup) → any instance can validate it. The **refresh token is stateful** (stored in DB)
to allow revocation — but the DB is a shared backing service (factor 4), not process
memory. That's why refresh tokens live in a table, not in RAM.

### Factor 11 — Logs to stdout
The app does not write or rotate log files. It writes to `stdout`; the platform
(Docker, CloudWatch) collects and stores them. A consequence of statelessness — the
instance's local disk is ephemeral.

## Why it matters
Following the 12 factors lets the app scale horizontally (stateless), move between
clouds (env + backing services), and deploy safely (build/release/run separated,
config externalized). This is the foundation of "cloud-native".
