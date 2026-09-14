# Spec: Pickup Verification (Staff)

## Requirement

FR-05 — unique QR code/order ID lets staff verify and retrieve an order at
pickup. Staff flow in architecture.md: Kitchen Dashboard -> Verify Pickup.

## Acceptance criteria

- Staff enters an order ID (QR scanning is out of scope for this scaffold;
  order ID entry is the documented fallback per ui-ux.md).
- Looking up an unknown ID shows a clear "not found" result.
- An order found but not yet `ready` cannot be marked picked up — staff sees
  its current status instead.
- An order that is `ready` shows its details and a "Confirm Pickup" action.
- Confirming sets the order's status to `picked_up` and disables further
  confirmation for that order.
- An order already `picked_up` shows that it was already collected.

## States

- Idle: no ID submitted yet.
- Not found: ID doesn't match any order.
- Found, not ready: status shown, no pickup action.
- Found, ready: confirm action available.
- Found, already picked up: confirmation disabled, picked-up state shown.

## Status

Wired to the real backend: looks up by order number via
`GET /orders?orderNumber=...`, confirms via `POST /orders/:id/pickup`.
Route guarded by `ProtectedRoute` (roles: STAFF, ADMIN).
