# CLAUDE.md

Guide for Claude Code (and for the developer) for the **Sanctum** project.
Read at the start of every session. Keep it up to date.

## What this project is

Sanctum (tagline: *your private library*) is a personal book library with social
features — the experience should feel like stepping into a cozy, lamp-lit room
steeped in history, a quiet world of books. It's a learning
fullstack project built to prepare for work / technical interviews. The goal is a
production-like application: with tests, clean architecture, and CI/CD.

Full spec: see [`docs/TECH_SPEC.md`](docs/TECH_SPEC.md).

## Working agreement

- **The developer writes all the code themselves.** Claude provides detailed,
  step-by-step instructions and explanations, and answers questions along the way.
  Do NOT write large chunks of code for the developer unless explicitly asked —
  the point is learning.
- For each step, explain *what* we do, *why*, and *how it tends to be asked in
  interviews*.
- **Language rule:** chat with the developer may be in Russian/Ukrainian, but
  ALL documentation, code, comments, and committed artifacts MUST be in English.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite, Apollo Client, React Router |
| Backend | Node.js + TypeScript, Apollo Server, Express |
| ORM / DB | Prisma + PostgreSQL |
| Auth | JWT (access + refresh) |
| External API | Google Books API |
| Files | AWS S3 |
| Infra | AWS RDS, S3 + CloudFront, EC2 |
| CI/CD | GitHub Actions |
| Tests | Jest (backend), Vitest + React Testing Library (frontend) |

## Structure (monorepo)

```
GogGo/
├── client/          # React app
├── server/          # Node.js + GraphQL API
├── docs/            # documentation and spec
│   └── TECH_SPEC.md
├── docker-compose.yml   # local PostgreSQL
└── CLAUDE.md
```

## Commands (fill in as we build)

```bash
# Local DB
docker compose up -d

# Backend
cd server && npm run dev

# Frontend
cd client && npm run dev

# Tests
cd server && npm test
cd client && npm test
```

## Roadmap

- [x] 0. Setup: monorepo, TS, linters, docker-compose with Postgres
- [x] 1. DB: Prisma schema (User, Book, Shelf, Review), migrations, seeds
- [x] 2. GraphQL API: types, queries, mutations, resolvers
- [x] 3. Auth: register/login, JWT + refresh, resolver guards
- [x] 4. Google Books: search and import books
- [x] 5. DataLoader: fix N+1 on relations
- [x] 6. React UI: Apollo Client, pages, shelves
- [ ] 7. S3: cover/avatar uploads
- [ ] 8. Tests: backend + frontend
- [ ] 9. CI/CD: GitHub Actions
- [ ] 10. AWS deploy: RDS, S3+CloudFront, EC2
- [ ] 11. AI recommendations: pick book(s) → Claude suggests 5 similar by
      vibe/theme, each resolved through Google Books (covers + import)

## Deployment plan (AWS Free Tier)

Deploy fully on AWS, staying within the 12-month Free Tier (target cost ~$0):

- **Frontend + files:** S3 + CloudFront (CloudFront 1 TB/mo is always free).
- **Backend (Node):** EC2 `t2.micro` (750 h/mo free = one server 24/7).
- **Database:** RDS PostgreSQL `db.t3.micro` (750 h/mo + 20 GB free).

Rules to avoid charges:
1. Set **AWS Budgets** alert at **$1** immediately after registering.
2. Only **one** EC2 and **one** RDS instance.
3. Use a **single region** (e.g. `eu-central-1`) for everything.
4. Free Tier ends after 12 months → shut down or expect ~$15–25/mo.

The developer has no AWS account yet. Register only at **stage 10** (deploy) so the
12-month clock isn't wasted. The S3 bucket (stage 7) is the only thing created earlier.

## Conventions

- TypeScript strict mode everywhere.
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:` ...).
- Before committing: lint + tests pass.
- Secrets only in `.env` (never committed); keep a `.env.example`.
