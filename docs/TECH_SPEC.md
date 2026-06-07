# Technical Specification — Sanctum

> Version 1.0 · Learning fullstack project for work/interview preparation.

## 1. Goal

Build a production-like "personal book library" application to practice the
**Node.js + React + GraphQL + PostgreSQL + AWS** stack. Focus on engineering
practices: type safety, tests, clean architecture, CI/CD, and cloud deployment.

## 2. Overview

A user registers, searches for books via the Google Books API, adds them to their
"shelves" (Want to read / Reading / Read), rates them, and writes reviews. They can
see their own library, statistics, and (optionally) other users' public profiles.

## 3. Roles

- **Guest** — can search books and view public profiles/reviews.
- **User** — everything a guest can, plus own shelves, ratings, reviews, profile.
- *(optional, future)* **Admin** — review moderation.

## 4. Functional requirements

### 4.1 Authentication
- Register with email + password (password hashed with bcrypt/argon2).
- Login → issues a short-lived access token and a long-lived refresh token.
- Refresh the access token using the refresh token.
- Logout (refresh token invalidation).
- Protected operations require a valid access token.

### 4.2 Books
- Search books via the Google Books API (by title/author/ISBN).
- Import a selected book into the local DB (cached, to avoid re-hitting the API).
- Book card: cover, author(s), description, year, ISBN.

### 4.3 Shelves
- Three system shelves per user: `WANT_TO_READ`, `READING`, `READ`.
- Add / remove a book from a shelf, move between shelves.
- View shelf contents.

### 4.4 Ratings and reviews
- Rate a book from 1 to 5.
- Text review (markdown): create / edit / delete.
- List reviews per book; reviews shown on the user profile.

### 4.5 Profile
- Avatar (uploaded to S3), name, bio.
- Statistics: number read, average rating, breakdown by shelf.

### 4.6 Files
- Upload covers (if missing from the API) and avatars to AWS S3.
- Serve via presigned URLs or CloudFront.

## 5. Non-functional requirements

- **TypeScript** strict on both frontend and backend.
- **Performance:** solve the N+1 problem in GraphQL via DataLoader.
- **Security:** password hashing, input validation, injection protection (Prisma
  parameterizes queries), CORS, rate limiting on auth.
- **Tests:** unit + integration on the backend (resolvers, services); component
  tests on the frontend. Reasonable coverage of key logic, not coverage for its own sake.
- **Observability:** structured logging, GraphQL error handling.
- **CI/CD:** on every push — lint + tests + build; deploy on merge to main.

## 6. Data model (draft)

```
User
  id            UUID  PK
  email         string unique
  passwordHash  string
  name          string
  bio           string?
  avatarUrl     string?
  createdAt     datetime

Book                       # cache of books imported from Google Books
  id            UUID  PK
  googleId      string unique
  title         string
  authors       string[]   # or a separate Author table (normalization)
  description   string?
  coverUrl      string?
  publishedYear int?
  isbn          string?

Shelf                      # user-book link with a status
  id            UUID  PK
  userId        UUID  FK -> User
  bookId        UUID  FK -> Book
  status        enum(WANT_TO_READ, READING, READ)
  addedAt       datetime
  @@unique([userId, bookId])

Review
  id            UUID  PK
  userId        UUID  FK -> User
  bookId        UUID  FK -> Book
  rating        int   (1..5)
  body          string?    # markdown
  createdAt     datetime
  updatedAt     datetime
  @@unique([userId, bookId])

RefreshToken               # to invalidate sessions
  id            UUID  PK
  userId        UUID  FK -> User
  tokenHash     string
  expiresAt     datetime
  revokedAt     datetime?
```

Relations: `User 1—N Shelf`, `Book 1—N Shelf`, `User 1—N Review`, `Book 1—N Review`.

## 7. GraphQL API (draft)

```graphql
type Query {
  me: User
  user(id: ID!): User
  searchBooks(query: String!, page: Int): [BookSearchResult!]!   # Google Books
  book(id: ID!): Book
  myShelf(status: ShelfStatus): [ShelfItem!]!
  reviewsForBook(bookId: ID!): [Review!]!
}

type Mutation {
  register(input: RegisterInput!): AuthPayload!
  login(input: LoginInput!): AuthPayload!
  refreshToken(token: String!): AuthPayload!
  logout: Boolean!

  addToShelf(bookId: ID!, status: ShelfStatus!): ShelfItem!
  moveOnShelf(bookId: ID!, status: ShelfStatus!): ShelfItem!
  removeFromShelf(bookId: ID!): Boolean!

  upsertReview(bookId: ID!, rating: Int!, body: String): Review!
  deleteReview(bookId: ID!): Boolean!

  updateProfile(input: UpdateProfileInput!): User!
  requestAvatarUploadUrl(contentType: String!): UploadUrl!   # presigned S3
}
```

## 8. Implementation stages

See the roadmap in [`CLAUDE.md`](../CLAUDE.md). Each stage = a separate branch/PR.

| # | Stage | Result |
|---|---|---|
| 0 | Setup | Monorepo skeleton, TS, linters, local Postgres |
| 1 | DB | Prisma schema + migrations + seeds |
| 2 | GraphQL API | Working queries/mutations without auth |
| 3 | Auth | JWT, register/login/refresh, guard |
| 4 | Google Books | Search + import |
| 5 | DataLoader | No N+1 on relations |
| 6 | React UI | Shelves, search, reviews in the browser |
| 7 | S3 | Avatar/cover uploads |
| 8 | Tests | Backend + frontend |
| 9 | CI/CD | GitHub Actions green |
| 10 | Deploy | App running on AWS |

## 9. Out of scope (future)

- Subscriptions / realtime (GraphQL Subscriptions).
- Friends activity feed, following other users.
- Book recommendations.
- Mobile app.

## 10. MVP definition of done

- [ ] Can register and log in.
- [ ] Can find a book and add it to a shelf.
- [ ] Can rate a book and write a review.
- [ ] Shelves and statistics are displayed in the UI.
- [ ] Avatar uploads to S3.
- [ ] CI is green and the app is deployed to AWS.
```

## 11. Deployment (AWS Free Tier)

Target cost ~$0 for the first 12 months:

| Layer | Where | Cost |
|---|---|---|
| Frontend (React) | S3 + CloudFront | $0 |
| Files | S3 | $0 |
| Backend (Node) | EC2 `t2.micro` (750 h/mo free) | $0 |
| Database (Postgres) | RDS `db.t3.micro` (750 h/mo + 20 GB free) | $0 |

Guardrails: set an **AWS Budgets** alert at **$1** right after registering; keep a
**single** EC2 and **single** RDS instance; use **one region** (`eu-central-1`).
Register the AWS account only at stage 10 to preserve the 12-month Free Tier window.
