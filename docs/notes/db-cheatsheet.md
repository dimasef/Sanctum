# Database cheatsheet — inspecting Sanctum data

Local Postgres runs in Docker (`docker compose up -d`), container `bookshelf-db`,
database/user/password all `bookshelf`.

> Table names are PascalCase (`"User"`, `"Book"`, ...), so they MUST be wrapped in
> double quotes in SQL — otherwise Postgres lowercases them and the table is not found.

## Opening psql

```bash
# Interactive session (exit with \q)
docker exec -it bookshelf-db psql -U bookshelf -d bookshelf

# One-off query without entering a session
docker exec bookshelf-db psql -U bookshelf -d bookshelf -c "SELECT ..."
```

## psql meta-commands (schema/structure)

```
\dt                 -- list all tables
\d "User"           -- structure of a table (columns, types, indexes, FKs)
\di                 -- all indexes
\dn                 -- schemas
\l                  -- list databases
\x                  -- toggle expanded output (good for wide rows)
\q                  -- quit
```

## Domain queries

### Overview: who reads what (User × Book × Shelf × Review)
```sql
SELECT u.name AS reader, b.title AS book, s.status AS shelf, r.rating
FROM "Shelf" s
JOIN "User" u ON u.id = s."userId"
JOIN "Book" b ON b.id = s."bookId"
LEFT JOIN "Review" r ON r."userId" = s."userId" AND r."bookId" = s."bookId"
ORDER BY u.name, b.title;
```

### Row counts across all tables
```sql
SELECT
  (SELECT count(*) FROM "User")         AS users,
  (SELECT count(*) FROM "Book")         AS books,
  (SELECT count(*) FROM "Shelf")        AS shelves,
  (SELECT count(*) FROM "Review")       AS reviews,
  (SELECT count(*) FROM "RefreshToken") AS tokens;
```

### Most recently registered users
```sql
SELECT id, email, name, "createdAt"
FROM "User"
ORDER BY "createdAt" DESC
LIMIT 10;
```

### Cached books (imported from Google Books)
```sql
SELECT title, authors, "publishedYear", isbn, "googleId"
FROM "Book"
ORDER BY title;
```

### A user's shelves by email
```sql
SELECT s.status, b.title, s."addedAt"
FROM "Shelf" s
JOIN "User" u ON u.id = s."userId"
JOIN "Book" b ON b.id = s."bookId"
WHERE u.email = 'demo@bookshelf.dev'
ORDER BY s."addedAt" DESC;
```

### Refresh token state (active / revoked / expired) — handy for auth debugging
```sql
SELECT
  u.email,
  count(*) AS total,
  count(*) FILTER (WHERE rt."revokedAt" IS NOT NULL) AS revoked,
  count(*) FILTER (WHERE rt."expiresAt" < now())     AS expired
FROM "RefreshToken" rt
JOIN "User" u ON u.id = rt."userId"
GROUP BY u.email;
```

### Profile-style stats (read count + average rating)
```sql
SELECT
  u.name,
  count(*) FILTER (WHERE s.status = 'READ')    AS read_count,
  count(*) FILTER (WHERE s.status = 'READING') AS reading_count,
  round(avg(r.rating), 2)                       AS avg_rating
FROM "User" u
LEFT JOIN "Shelf" s  ON s."userId" = u.id
LEFT JOIN "Review" r ON r."userId" = u.id
GROUP BY u.name;
```

### Find duplicate books (e.g. two "Pragmatic Programmer" — seed vs real import)
```sql
SELECT title, count(*), array_agg("googleId") AS google_ids
FROM "Book"
GROUP BY title
HAVING count(*) > 1;
```

## Resetting data

```sql
-- Wipe all rows, keep table structure.
-- CASCADE handles foreign keys, RESTART IDENTITY resets counters.
TRUNCATE "RefreshToken", "Review", "Shelf", "Book", "User" RESTART IDENTITY CASCADE;
```

Re-seed after wiping:
```bash
cd server && npx prisma db seed
```

Full schema reset (drop tables, re-run migrations + seed):
```bash
cd server && npx prisma migrate reset
```
