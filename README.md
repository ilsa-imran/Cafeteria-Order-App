# University Cafeteria Pre-Order App

A full-stack web application that lets students pre-order cafeteria food and select a pickup time, so cafeteria staff can prepare orders ahead of time and reduce rush-hour queues.

Built for **SEN 220 - Software Engineering** (Instructor: Syed Mubashir Ali) as a Complex Computing Problem assignment. Requirements, stakeholders, and risks below trace directly back to the assignment case (see `SE_CCP.docx`).

## Assignment context

**Problem**: students face queues and congestion at the cafeteria, especially during rush hours.

**Goal**: allow students to pre-order food and select pickup timing so staff can prepare orders efficiently and reduce queue time.

### Stakeholders

- Students — browse food, place orders, select pickup time, track orders, collect food
- Chef — receive and prepare confirmed orders
- Cafeteria Staff — manage orders, pickup verification, availability
- Cafeteria Manager — manage menu, prices, availability and operations
- Faculty Members — stakeholder affected by cafeteria efficiency

### Functional requirements

| ID | Requirement | Status |
|---|---|---|
| FR-01 | Separate User and Staff Member modes | ✅ Done |
| FR-02 | Flexible pickup time (immediately / 30 min / 1 hour) | ✅ Done |
| FR-03 | Confirmed orders sent directly to the kitchen dashboard | ✅ Done |
| FR-04 | Real-time order tracking + ready notification | ✅ Done |
| FR-05 | Unique QR code / order ID for pickup | ✅ Done |

### Non-functional requirements

| ID | Requirement | Status |
|---|---|---|
| NFR-01 | Load within 2 seconds under normal conditions | ✅ Measured — see `.claudeFiles/.claude/testing.md` |
| NFR-02 | Sleek, minimalist UI with specified colors/fonts | ⚠️ Colors exact; Fredoka font exact; Vanity/Arschane Regular are not real freely-licensed fonts, so Quicksand/Poppins stand in as a documented fallback |
| NFR-03 | Only authorized staff/admin may modify menu items, prices, availability | ✅ Done — enforced server-side, tested |

### Risks & umbrella activities

| Risk | Umbrella activity |
|---|---|
| Fake orders by students | Risk Management |
| Server crash / slowdown during rush hours | Technical Review — see the load-test findings in `.claudeFiles/.claude/risk-management.md` (a real order-number collision bug was found and fixed under concurrent load) |

Full detail on all of the above lives in [`.claudeFiles/.claude/requirements.md`](.claudeFiles/.claude/requirements.md) and [`.claudeFiles/.claude/risk-management.md`](.claudeFiles/.claude/risk-management.md).

## Architecture

Simple layered architecture — no microservices, no Kubernetes (deliberately; see `.claudeFiles/.claude/architecture.md`):

```
Presentation (React)
        |
Application / API (Express)
        |
Business Logic (feature services)
        |
Data Access (Prisma)
        |
Database (SQLite)
```

### Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 19 + TypeScript + Vite | Fast dev loop, minimal config |
| Styling | Tailwind CSS v4 | Fast to apply the exact brand palette |
| Animation | Framer Motion | Used deliberately (ordering flow, "Ready" state, QR reveal) — never on the kitchen dashboard, which needs to stay scannable |
| Routing | React Router v7 | — |
| Backend | Node.js + Express + TypeScript | Minimal REST framework, no unnecessary structure |
| ORM / DB | Prisma + SQLite | No separate DB server to install/run; same schema works against Postgres later without an app rewrite |
| Auth | JWT + bcrypt | Stateless tokens, industry-standard password hashing |
| Validation | Zod | Request validation at the API boundary |
| Testing | Vitest + Supertest (backend), Vitest + React Testing Library (frontend) | |
| Load testing | autocannon | Rush-hour risk verification |

Every non-obvious technical choice is documented as an **Implementation Decision** in the relevant file under `.claudeFiles/.claude/`, per this project's academic-integrity rule: nothing is silently added and presented as an assignment requirement.

## Project structure

```
SE_CCP/
├── SE_CCP.docx              — the assignment submission document
├── .claudeFiles/            — project reference docs (architecture, decisions, conventions)
│   └── .claude/*.md
├── frontend/                — React + Vite app
│   ├── src/features/        — one folder per feature (menu, cart, pickup, ...)
│   ├── src/shared/          — cross-feature code (api client, auth/cart state, components)
│   └── specs/               — one spec per feature, written before implementation
└── backend/                 — Express + Prisma API
    ├── src/features/        — auth, menu, orders, pickup-verification
    ├── src/shared/          — middleware, prisma client, jwt/env helpers
    ├── prisma/               — schema, migrations, seed script
    ├── scripts/load-test.mjs — rush-hour load test
    └── specs/               — one spec per API area
```

Frontend and backend both follow the same **feature-based, spec-driven** convention: before building a feature, a short spec (`specs/<feature>.md`) states which requirement it implements, its acceptance criteria, and the states it must handle — documented in `.claudeFiles/.claude/dev-workflow.md`.

## Getting started

Requires Node.js (LTS) and npm.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # fill in a real JWT_SECRET locally
npm run prisma:migrate      # creates the SQLite database
npm run prisma:seed         # seeds demo accounts + menu items
npm run dev                 # http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

The frontend expects the backend at `http://localhost:4000` by default (`frontend/.env` → `VITE_API_URL`).

### Demo accounts (from `backend/prisma/seed.ts`)

| Role | Email | Password |
|---|---|---|
| Student | `student@university.test` | `student12345` |
| Staff | `staff@cafeteria.test` | `staff12345` |
| Admin / Cafeteria Manager | `manager@cafeteria.test` | `admin12345` |

Staff/Admin accounts are **not** self-registerable through the public sign-up form (that would defeat NFR-03) — the seed script bootstraps the first Admin, and from there an Admin can create further Staff/Admin accounts in-app via **Create Staff Account** (`POST /auth/staff`, Admin-only).

## Features

### Student

Sign in / register → browse menu → food item details → cart → pickup time → order confirmation (unique order ID + server-generated QR) → order tracking → order history → **in-app "ready" notification** (appears from any page, not just Tracking, while an order is active).

### Staff

Kitchen dashboard (view orders, advance status through the controlled lifecycle Confirmed → Preparing → Ready → Picked Up) → pickup verification (look up by order number, confirm pickup) → menu management (add/edit/remove items, prices, availability).

### Admin (Cafeteria Manager)

Everything Staff can do, plus **Create Staff Account** — the in-app flow for provisioning new Staff/Admin logins.

Every protected action is enforced **server-side** — frontend route guards are a UX convenience only, never the real security boundary. A student token gets a 403 from the API itself if it tries to hit a staff-only endpoint, not just a hidden button.

## Testing

```bash
cd backend && npm test     # Vitest + Supertest — 19 tests
cd frontend && npm test    # Vitest + React Testing Library — 11 tests
```

Backend tests cover: server-side total calculation, unavailable-item rejection, cross-student order isolation, controlled status transitions, pickup guards, order-number uniqueness under concurrency, order-history scoping, and staff-account-creation authorization.

Frontend tests cover: frontend/backend enum translation (`apiMappers`) and cart math (quantity dedup, zero-quantity removal, totals, confirm-order guards).

### Load testing (rush-hour risk)

```bash
cd backend && npm run load-test
```

This is what caught a real bug: concurrent order creation could generate duplicate order numbers under load. Fixed and covered by a regression test. Full writeup in `.claudeFiles/.claude/risk-management.md`.

## Known limitations

- **Fonts**: Vanity and Arschane Regular aren't real, obtainable fonts — Quicksand/Poppins are documented fallbacks pending the actual font files.
- **Ready notification**: polling-based (checks every 8s), not a true OS push notification — only works while the browser tab is open. Push notifications are explicitly optional per the assignment's scope control.
- **Deployment**: intentionally out of scope for now — the app runs locally only.
- **Word document**: the "Screenshot" (AI chat) section of `SE_CCP.docx` needs a manual screen capture of the AI conversation added by hand — no tool has access to that window to automate it.

## Documentation map

- [`.claudeFiles/CLAUDE.md`](.claudeFiles/CLAUDE.md) — top-level project instructions and academic-integrity rules
- [`.claudeFiles/.claude/`](.claudeFiles/.claude/) — architecture, backend, frontend, database, API, security, testing, coding conventions, risk management, deployment, academic submission references
- `frontend/specs/*.md`, `backend/specs/*.md` — one spec per feature/API area, written before implementation
