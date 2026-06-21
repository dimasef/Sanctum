# Sanctum

[![CI](https://github.com/dimasef/Sanctum/actions/workflows/ci.yml/badge.svg)](https://github.com/dimasef/Sanctum/actions/workflows/ci.yml)

*Your private library* — a personal book library with social features, built to
feel like stepping into a cozy, lamp-lit study steeped in history.

This is a learning-oriented, production-like fullstack project: typed end to end,
tested, with clean architecture and CI/CD.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite, Apollo Client, React Router, MUI |
| Backend | Node.js + TypeScript, Apollo Server, Express |
| ORM / DB | Prisma + PostgreSQL |
| Auth | JWT (access + refresh) |
| External API | Google Books API |
| Files | AWS S3 (presigned uploads) |
| CI | GitHub Actions |
| Tests | Vitest (+ React Testing Library) |

## Structure

```
.
├── client/   # React app
├── server/   # Node.js + GraphQL API
└── docs/      # documentation and spec (see docs/TECH_SPEC.md)
```

## Getting started

Requirements: Node (see `.nvmrc`), Docker (for local Postgres).

```bash
# 1. Local database
docker compose up -d

# 2. Backend
cd server
cp .env.example .env        # fill in the values
npm install
npx prisma migrate dev
npm run dev

# 3. Frontend (in another terminal)
cd client
npm install
npm run dev
```

## Scripts

Each package (`client`, `server`) exposes:

```bash
npm run lint        # ESLint
npm run typecheck   # tsc
npm test            # Vitest
```

## Tests & CI

Vitest runs in both packages. On every pull request and push to `main`, GitHub
Actions runs `lint`, `typecheck`, and `test` for `client` and `server`.

## License

ISC
