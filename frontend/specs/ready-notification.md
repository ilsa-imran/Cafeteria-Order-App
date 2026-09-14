# Spec: Ready Notification (Student)

## Requirement

FR-04 — "receive a notification when an order is ready for pickup." This
closes the gap noted in `order-tracking.md`: tracking already showed
status, but nothing surfaced the "ready" moment if the student wasn't
already looking at the Tracking page.

## Acceptance criteria

- While a student has an active order (not yet picked up) and the app
  open, a banner appears from any page — not just Tracking — the moment
  the order's status becomes `ready`.
- The banner names the order and links straight to Tracking.
- Dismissing it doesn't bring it back for the same ready event.
- Only one active watch at a time (the most recent order placed this
  session — `CartContext.lastOrder`), matching the existing scope of
  Order Tracking (`order-tracking.md`).

## Implementation Decision: polling, not push

No websocket/push infrastructure exists (`architecture.md` favors a
simple layered architecture; the assignment does not require real push
notifications). The banner is driven by polling `GET /orders/:id` every
8 seconds while there's an active order to watch, comparing the fetched
status against what was last seen.

**Known limitation, stated plainly**: this only works while the browser
tab is open — it is not a true push notification (no OS-level alert, no
notification while the tab/app is closed). That is an accepted scope
boundary, not an oversight: `requirements.md`'s scope control already
lists "push notifications" as an optional extension, not a core
requirement — this delivers the in-app equivalent for the FR-04 wording
without building out push infrastructure that the assignment doesn't ask
for.

## States

- No active order: nothing renders.
- Active order, not yet ready: nothing renders (polling silently).
- Order becomes ready: banner slides in, stays until dismissed or the
  student navigates to Tracking.
- Order already picked up: polling stops.
