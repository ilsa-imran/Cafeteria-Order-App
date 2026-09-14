# Feature Checklist

## Student

- [x] Student can access the user mode.
- [x] Student can view available menu items.
- [x] Student can select food items.
- [x] Student can choose a pickup time.
- [x] Student can confirm an order.
- [x] Confirmed order receives unique order ID.
- [x] Confirmed order receives QR code.
- [x] Student can track order status.
- [x] Student receives ready notification. (in-app banner appears from any
      page the moment the order becomes Ready — polling-based, not a true
      OS push notification; see `ready-notification.md`. Works only while
      the browser tab is open, which is an accepted scope boundary.)
- [x] Student can use order ID as pickup fallback.

## Staff

- [x] Staff can access staff mode.
- [x] Staff can see confirmed orders.
- [x] Staff can see pickup timing.
- [x] Staff can update preparation status.
- [x] Staff can mark an order ready.
- [x] Staff can verify pickup.

## Menu administration

- [x] Authorized staff/admin can add menu items.
- [x] Authorized staff/admin can edit menu items.
- [x] Authorized staff/admin can remove menu items.
- [x] Authorized staff/admin can update prices.
- [x] Authorized staff/admin can update availability.
- [x] Unauthorized users are rejected.

## Additional screens (not required by the assignment, built for completeness)

- [x] Food item details page.
- [x] Order history page.

## Quality

- [x] Loading states work.
- [x] Empty states work.
- [x] Error states work.
- [x] Form validation works.
- [x] Important business rules have tests. (backend: 12 tests; frontend: 11 tests)
- [x] Performance has been measured. (NFR-01 — see testing.md)
- [x] Rush-hour behavior has been reviewed. (load test found and fixed a real
      order-number collision bug under concurrency — see risk-management.md)
- [x] No secrets are committed. (.env gitignored on both frontend and backend)
- [x] Build succeeds. (frontend `npm run build`, backend `npm run build`)

## Not yet done

- [ ] Deployment (explicitly on hold per current instructions).
- [ ] Prompt-to-AI and screenshot sections of the submission document.
