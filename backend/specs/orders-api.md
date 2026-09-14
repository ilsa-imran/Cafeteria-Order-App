# Spec: Orders API

## Requirement

FR-02 (pickup time), FR-03 (kitchen dashboard), FR-04 (tracking), FR-05
(QR/order ID).

## Endpoints

### POST /orders

STUDENT only (authenticated). Creates an order owned by the caller.

Request: `{ items: [{ menuItemId, quantity }], pickupTime }`

Server behavior (never trust the client for any of this, per `backend.md`
and `api.md`):
- Re-fetches each menu item's current price and availability from the
  database. Rejects the order (`400`) if any item is unavailable or
  quantity <= 0.
- Calculates the authoritative total server-side.
- Generates a unique order id/number.
- Sets initial status to `CONFIRMED`.

Response: `201` with the created order (id, items, pickupTime, status,
total).

### GET /orders/:id

Owner STUDENT or any STAFF/ADMIN. `403` if a student requests another
student's order (per `security.md`: "students must not... modify another
student's order" — extended here to reading, since order contents are
personal data).

### GET /orders

Authenticated, behavior depends on role:
- **STAFF/ADMIN**: lists all orders (kitchen dashboard). Supports optional
  `status` and `orderNumber` query filters (e.g. `?status=READY`,
  `?orderNumber=ORD-042081`). The `orderNumber` filter backs Pickup
  Verification — staff look up an order by the human-readable number on
  the QR/receipt, not the internal database id.
- **STUDENT**: lists only the caller's own orders (order history), newest
  first. `status`/`orderNumber` filters are rejected with `403` for
  students — a student has no legitimate reason to filter across orders
  they don't own by those fields, and the id-based lookup already exists
  via `GET /orders/:id`.

### PATCH /orders/:id/status

STAFF or ADMIN only. Request: `{ status }`.

Enforces the controlled lifecycle from `backend.md`:
`CONFIRMED -> PREPARING -> READY -> PICKED_UP`. Any other transition is
rejected with `400` (e.g. skipping a step, or moving backwards).

### GET /orders/:id/qr

Owner STUDENT or STAFF/ADMIN. Returns a QR code image encoding the order
id. Generated server-side (see Implementation Decision in `backend.md`) —
this replaces the frontend's client-side QR generation once the frontend
is wired to this API.

## Status

Implemented. Every order response (create, get, list, status update,
pickup) includes `items` with their `menuItem` details, so the frontend
never has to make a second request to render items.
