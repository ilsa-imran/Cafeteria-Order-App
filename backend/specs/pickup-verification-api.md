# Spec: Pickup Verification API

## Requirement

FR-05 — QR code/order ID verifies and retrieves the order at pickup.

## Endpoint

### POST /orders/:id/pickup

STAFF or ADMIN only.

Server behavior:
- `404` if no order matches `:id`.
- `409` if the order's status is not `READY` (mirrors the frontend's
  pickup-verification spec: an order not yet ready cannot be picked up).
- `409` if the order is already `PICKED_UP` (idempotency guard — staff
  scanning the same QR twice should get a clear "already picked up"
  response, not a silent success).
- On success: sets status to `PICKED_UP`, returns the updated order.

## Status

Not yet implemented.
