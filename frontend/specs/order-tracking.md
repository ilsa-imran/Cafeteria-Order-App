# Spec: Order Tracking (Student)

## Requirement

FR-04 — Real-time order tracking. The "ready notification" half of FR-04
is covered separately by `ready-notification.md`, since it needed to work
across every page, not just this one.

## Acceptance criteria

- Status progresses through: Confirmed → Preparing → Ready → Picked Up.
- The "Ready" state must be highly noticeable (ui-ux.md).
- Status source of truth is the backend; the frontend only renders it.

## States

- Loading: status not yet fetched.
- Success: stepper renders current status.
- Error: fetch/poll failed, retry affordance shown.

## Status

Wired to `GET /orders/:id` on the real backend. Accepts an optional
`:orderId` route param (`/tracking/:orderId`) so Order History can link to
any past order, not just the one just placed — falls back to
`CartContext.lastOrder` when no param is given (the "Track Order" link
from Order Confirmation). No polling/websocket — a manual "Refresh status"
button re-fetches, which is enough for a university project demo. Redirects
to Menu if there's no order to track or the id doesn't resolve.
