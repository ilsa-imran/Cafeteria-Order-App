# Frontend Reference

## Purpose

The frontend provides the student and staff user experience.

## Main screens

### Student

- Login
- Menu
- Food item details
- Cart
- Pickup time selection
- Order confirmation
- Order tracking
- QR/order ID
- Order history

### Staff

- Staff login
- Kitchen dashboard
- Order details
- Order status management
- Pickup verification
- Menu management
- Availability management

## UX requirements

The interface should be:
- clear,
- responsive,
- fast,
- accessible,
- minimalist,
- easy to understand during rush-hour use.

## Visual direction

Use the assignment's visual direction:
- #F4B6C2 blush pink
- #F8D7C4 soft peach
- #FFF7F0 warm cream
- #222222 dark charcoal

Fonts specified by the assignment:
- Vanity
- Arschane Regular
- Fredoka

If the specified fonts are unavailable or licensing prevents their use, document the implementation decision and use an appropriate fallback.

## Required UI states

Every data-driven screen should consider:
- Loading
- Empty
- Success
- Error
- Disabled
- Unauthorized

## Student ordering UX

The order process should minimize unnecessary steps:

```text
Menu
 -> Cart
 -> Pickup Time
 -> Payment Choice if implemented
 -> Confirm
 -> QR / Order ID
```

## Kitchen UX

Kitchen staff should be able to quickly identify:
- Order ID
- Items
- Quantity
- Pickup time
- Current status

Avoid visually noisy interfaces.

## Frontend security

Do not rely on frontend role checks for authorization.

The frontend may use role information to improve navigation, but every protected operation must be verified by the backend.

## Implementation Decision: Frontend stack

The assignment does not mandate a specific frontend framework or animation library. To satisfy the "modern and animated" direction the student additionally requested, the following stack was chosen:

- **React 18 + TypeScript** — component model fits the multi-screen student/staff flows; TypeScript encodes the FR/NFR data shapes (order, menu item, pickup time, status) as types to support spec-driven development (see `dev-workflow.md`).
- **Vite** — fast dev server/build, minimal config, keeps the setup simple per `architecture.md`'s "avoid unnecessary complexity" rule.
- **Tailwind CSS** — utility-first styling makes it fast to apply the assignment's fixed color palette and keep spacing/typography consistent (`ui-ux.md` principle 6).
- **Framer Motion** — used deliberately and sparingly:
  - ordering-flow step transitions (Menu → Cart → Pickup → Confirm),
  - the "Ready" order-status state (must be "highly noticeable" per `ui-ux.md`),
  - QR/order-ID confirmation reveal.
  - **Not** used for decorative animation on the kitchen dashboard — `ui-ux.md` explicitly says to avoid unnecessary decorative elements on operational screens.
  - Respects `prefers-reduced-motion` per the accessibility section of `ui-ux.md`.

## Assumption: Brand fonts

"Vanity" and "Arschane Regular" are not standard freely-licensed fonts and were not supplied as files. Until the actual font files are provided:
- Fredoka (Google Fonts, matches the assignment spec exactly) is used as-is.
- A close free fallback is used in place of Vanity/Arschane Regular, documented in code where the `font-family` is declared.

If the instructor supplies the actual font files, replace the fallback and remove this note.

## Implementation Decision: QR code generation (superseded)

FR-05 requires a real, scannable QR code. Initially generated client-side
with the `qrcode` npm package as a stopgap before the backend existed. Now
that the backend is wired up, order/QR generation happens server-side
(`GET /orders/:id/qr` in `backend/specs/orders-api.md`) — the order number
is a trustworthy system of record instead of a client-generated value.
The frontend's `qrcode` dependency has been removed.
