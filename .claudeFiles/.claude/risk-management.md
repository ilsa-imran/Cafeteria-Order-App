# Risk Management Reference

## Risk 1 — Fake Orders by Students

### Risk

Students may place fake or unnecessary orders, causing:
- food wastage,
- incorrect demand estimation,
- unnecessary cafeteria workload.

### Umbrella activity

Risk Management.

### Control approach

Use a documented risk-management process:
1. Identify abuse scenarios.
2. Estimate likelihood and impact.
3. Define preventive controls.
4. Monitor suspicious behavior.
5. Review effectiveness.

Possible implementation controls may include:
- authenticated student accounts,
- order confirmation,
- order ownership checks,
- sensible cancellation rules if implemented,
- staff visibility into order activity.

Do not implement punitive or complex anti-abuse systems unless required.

## Risk 2 — Server Crash During Rush Hours

### Risk

The server may crash or become slow when many users access the application simultaneously.

### Umbrella activity

Technical Review.

### Control approach

Review:
- architecture,
- server capacity,
- database design,
- query efficiency,
- API response times,
- load behavior,
- failure handling.

Recommended verification:
- load testing,
- performance profiling,
- database query review,
- monitoring,
- capacity estimation.

### Load test findings (2026-09-14)

Ran `npm run load-test` (`backend/scripts/load-test.mjs`, autocannon, 50
concurrent connections, 10s) against `GET /menu` and `POST /orders`.

**Real bug found and fixed by this exercise**: order numbers were
generated from `Date.now()`'s last 6 digits. Under concurrent order
creation, multiple requests landing in the same millisecond generated the
same order number, and the database's unique constraint rejected the
duplicate — a genuine "orders fail during a rush" bug, not a hypothetical
one. First load-test run: 67 failed `POST /orders` requests out of several
thousand. Fixed by widening the id space (timestamp + a random suffix) and
adding a retry-on-conflict loop in `createOrder` (`orders/service.ts`) so
a residual collision is retried instead of failing the request. Re-ran
after the fix: 0 errors, 0 non-2xx across both endpoints. Regression test
added (`orders.test.ts`: "generates unique order numbers even when many
orders are created at the same instant" — 20 concurrent order creations,
asserts all succeed with distinct order numbers).

**Known constraint, not yet addressed**: p99 latency under 50 concurrent
connections reached several seconds (SQLite allows only one writer at a
time, so concurrent `POST /orders` calls serialize). Acceptable for a
university project's scale and demo, but a real deployment expecting
genuine rush-hour concurrency should move to Postgres — already anticipated
as the migration path in `backend.md`'s stack Implementation Decision,
since Prisma's schema/migrations work identically against either engine.

## Risk matrix

| Risk | Likelihood | Impact | Main control |
|---|---|---|---|
| Fake orders | To be assessed by team | High | Risk Management |
| Rush-hour server failure | To be assessed by team | High | Technical Review |

Do not invent numerical likelihood/impact values unless the team has assessed them.
