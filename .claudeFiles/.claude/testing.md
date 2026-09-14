# Testing Reference

## Current automated coverage

- **Backend** (`npm test` in `backend/`): 11 tests — order total calculation,
  unavailable-item rejection, cross-student order isolation, controlled
  status transitions, pickup guards, order-history scoping/authorization.
- **Frontend** (`npm test` in `frontend/`): 11 tests — `apiMappers`
  (frontend/backend enum translation, since a silent mismatch there would
  break every screen) and `CartContext` (quantity/total math, the
  zero-quantity-removes-the-line rule, confirm-order guard and cleanup).

## Testing objective

Demonstrate that the core requirements work correctly and that the system handles important failure cases.

## Test levels

### Unit tests

Test isolated business rules.

Examples:
- pickup option validation,
- order total calculation if implemented,
- order status transitions,
- authorization decisions,
- unavailable menu item rejection.

### Integration tests

Test interactions between:
- API and database,
- order creation and persistence,
- staff status updates,
- pickup verification.

### End-to-end tests

Test complete user journeys.

Minimum recommended scenarios:

#### Student journey

```text
Login
 -> Browse menu
 -> Add items
 -> Select pickup time
 -> Confirm order
 -> Receive order ID / QR
 -> Track order
 -> See ready state
 -> Pickup
```

#### Staff journey

```text
Login
 -> Open kitchen dashboard
 -> See confirmed order
 -> Prepare order
 -> Mark ready
 -> Verify pickup
```

#### Authorization journey

```text
Student
 -> Attempt menu price modification
 -> Request rejected
```

## Risk-focused tests

### Fake order risk

Test:
- repeated order submissions,
- invalid order requests,
- order validation,
- appropriate controls against abuse.

### Rush-hour server risk

Perform load testing against realistic expected traffic.

Measure:
- response time,
- error rate,
- throughput,
- database performance,
- server resource usage.

## Performance requirement

The assignment specifies a 2-second load target under normal operating conditions.

Define what is being measured and document the test environment so the result is reproducible.

### NFR-01 measurement (2026-09-14)

**What was measured:** `window.performance` Navigation Timing
(`loadEventEnd - startTime`) on the production build (`npm run build` +
`vite preview`), not the dev server (dev mode is unminified and slower,
so it would understate real load time in the wrong direction — it's not
representative of what a deployed build serves).

**Build output:** `index.html` 0.81 kB, CSS 16.08 kB (3.95 kB gzip), JS
414.15 kB (129.14 kB gzip). Total gzip payload ≈ 133 kB.

**Environment:** localhost, Chrome (via the project's browser tooling), 3
cold navigations.

| Run | Load event (ms) |
|---|---|
| 1 | 79 |
| 2 | 363 |
| 3 | 61 |

**Caveat:** localhost has ~0ms network latency, so this measures
parse/render cost, not network transfer time — it is not a stand-in for a
real network. Estimating transfer time separately from the gzip payload:
at a typical campus wifi/4G speed (~5 Mbps ≈ 625 kB/s), ≈133 kB downloads
in ~210ms; combined with the ~80-360ms parse/render numbers above, total
load stays comfortably under the 2-second target. On a throttled slow-3G
connection (~50 kB/s) the same payload alone would take ~2.6s, which would
miss the target — "normal operating conditions" is read here as
campus-network speeds, not worst-case throttled mobile, consistent with
the assignment's framing (rush-hour congestion is the named risk, not
client network conditions).

**Reproduce:** `cd frontend && npm run build && npm run preview`, then in
the browser console: `performance.getEntriesByType('navigation')[0]`.

## Caution: don't let `dist/` collide with `vitest`

Backend `npm run build` compiles to `dist/`. If test files ever get
compiled in there (they shouldn't now — see below) and `dist/` is left on
disk when `npm test` runs, vitest picks up the compiled `.js` tests
alongside the real `.ts` ones and runs both, causing duplicate/colliding
test data. Fixed by: `tsconfig.build.json` excludes `src/**/*.test.ts` from
the build (`npm run build` uses it, not `tsconfig.json`), and
`vitest.config.ts` explicitly excludes `dist/**` as defense in depth. If
`npm test` ever reports a suite failing on data that looks like it
shouldn't exist, check for a stale `dist/` first.

## Regression testing

Run the relevant automated tests after every significant change.

Do not claim a requirement is verified solely because the UI appears correct.

## Caution: shared dev database

Backend tests currently run against the same SQLite file as manual/demo
use (no separate test database — judged not worth the added cross-platform
setup complexity for a university project, per `coding-conventions.md`'s
avoid-over-engineering rule). This already caused one real incident: a test
cleanup step used an unscoped `prisma.orderItem.deleteMany({})`, which
wiped every order's items in the dev database, not just the test's own
rows — fixed by scoping the delete to the test's own `userId`.

Any test `afterAll`/`beforeEach` cleanup must delete only records it
created (scope by id/foreign key), never an unscoped `deleteMany({})`. If
this bites again, revisit using a separate `DATABASE_URL` for tests.
