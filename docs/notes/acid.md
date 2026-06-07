# ACID — quick reference

ACID = four guarantees a database provides for a **transaction** (a group of
operations that must succeed or fail as one unit).

## A — Atomicity
"All or nothing." Every operation in the transaction commits, or none does. On error
midway → **rollback** to the original state.

> In Sanctum: token rotation in `refresh` (`auth.service.ts`) wraps "revoke old
> refresh token" + "create new one" in `prisma.$transaction`. If the create fails,
> the revoke is rolled back — no "revoked but not reissued" state.

## C — Consistency
A transaction moves the DB from one **valid** state to another, never violating
integrity rules (constraints, foreign keys, unique, types).

> In Sanctum: `@@unique([userId, bookId])`, FK `userId → User`, `@unique` on email.
> A transaction that would break them never commits — the DB rejects it. The earlier
> `tokenHash` duplicate bug was consistency doing its job.

## I — Isolation
Concurrent transactions don't see each other's intermediate results — they behave as
if run sequentially. Without it: race conditions.

Isolation levels (weakest → strongest), each preventing more read anomalies:

| Level | Prevents |
|---|---|
| Read Uncommitted | almost nothing (allows dirty reads) |
| Read Committed | dirty reads (PostgreSQL default) |
| Repeatable Read | + non-repeatable reads |
| Serializable | + phantom reads (full isolation) |

Anomalies: **dirty read** (reading uncommitted data), **non-repeatable read** (same
row read twice differently), **phantom read** (new rows appear between reads).
Higher isolation = safer but slower (more locking).

## D — Durability
After `commit`, data survives crashes / power loss. Achieved via a **write-ahead log
(WAL)**: the change is written to an on-disk journal first, then applied; after a
crash the DB recovers from the journal.

## One-line answer
"ACID = transaction guarantees: Atomicity (all-or-nothing, rollback on error),
Consistency (integrity constraints never violated), Isolation (concurrent transactions
don't interfere; has isolation levels), Durability (committed data survives crashes).
PostgreSQL is ACID-compliant; example in this project is atomic refresh-token rotation
via `$transaction`."

## Bonus: ACID vs BASE
**BASE** (Basically Available, Soft state, Eventual consistency) is the NoSQL /
distributed model that trades strict consistency for availability and scale (eventual
consistency). Tied to the **CAP theorem**. Relational DBs (Postgres) are ACID; many
NoSQL stores are BASE. The choice is a trade-off for the workload.
