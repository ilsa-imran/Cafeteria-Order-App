# Spec: Order Confirmation

## Requirement

FR-05 — generate a unique QR code/order ID for each confirmed pre-order,
scannable at pickup or enterable as a fallback. Closes the gap between
Pickup Time selection and Order Tracking in the core flow (architecture.md).

## Acceptance criteria

- Confirming an order on the Pickup Time step generates a unique order ID
  and a real QR code encoding that ID.
- Confirmation page shows: order ID, QR code, ordered items, pickup time,
  and status (Confirmed).
- The QR/order ID reveal is a deliberate animated moment (frontend.md:
  Framer Motion is used for this specific reveal).
- After confirming, the cart is cleared so a new order can be started.
- A link to Order Tracking is available from this page.

## States

- No order to confirm: if the cart is empty when this page is reached
  directly, redirect back to Menu.
- Success: order confirmed, ID/QR/details shown.

## Status

Wired to the real backend: `POST /orders` creates the order server-side
(server calculates the total and generates the order number), and
`GET /orders/:id/qr` generates the QR code server-side. The frontend's
`qrcode` npm dependency has been removed — see the reversed Implementation
Decision in `frontend.md`.
