# Spec: Kitchen Dashboard (Staff)

## Requirement

FR-03 — Confirmed orders sent directly to the kitchen dashboard.

## Acceptance criteria

- Staff can see order ID, items, pickup time, and status for each order.
- Staff can advance an order to its next status in the controlled
  lifecycle (architecture.md staff flow: "Update Status"). No skipping —
  the backend rejects invalid transitions regardless of what the button
  offers.
- No decorative animation — ui-ux.md requires this screen stay scannable
  and fast during rush hour; the status-advance action is a plain button.
- Access is restricted to authenticated staff/admin, backend-enforced.

## States

- Loading, Empty (no active orders), Success, Unauthorized.

## Status

Wired to `GET /orders` and `PATCH /orders/:id/status` on the real backend.
Route guarded by `ProtectedRoute` (roles: STAFF, ADMIN).
