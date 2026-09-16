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

The assignment's mandated visual direction (NFR-02) is:
- #F4B6C2 blush pink
- #F8D7C4 soft peach
- #FFF7F0 warm cream
- #222222 dark charcoal

**Color palette — currently deviates from NFR-02, at the student's
request.** The four brand colors are defined once, as CSS custom
properties in `frontend/src/index.css`'s `@theme` block
(`--color-blush-pink`, `--color-soft-peach`, `--color-warm-cream`,
`--color-dark-charcoal`), and every component references them by name
(`var(--color-blush-pink)` etc.) rather than hardcoding hex values — this
is what made a palette swap a single-file change instead of a
find-and-replace across dozens of components. The student supplied a
different 4-color palette (a screenshot of swatches pulled from a plant
photo) and asked for it to replace the assignment colors. This was flagged
as a conflict with NFR-02 before making the change — the student chose to
proceed anyway; see `requirements.md`'s NFR-02 section for the full note.

**Why this needed more than a 4-line CSS edit (first swap).** The
assignment's original palette had one light-neutral role (cream) and one
dark-text role (charcoal); every button using the accent colors as a
background assumed dark text would be readable on them, because blush-pink
and soft-peach were light. The student's first custom palette (dark
green/burnt orange/sage/dark brown) skewed dark (3 of 4 colors mid-to-dark),
so every place that paired a `bg-blush-pink`/`bg-soft-peach` element with
(inherited or explicit) dark-charcoal text broke — text became nearly
invisible. Fixed by auditing every such pairing (~20 occurrences across 12
files: buttons, nav highlights, mode toggles, status badges) and switching
their text color to `--color-warm-cream` (the lightest available token)
instead, with a conditional class for toggle-style components (login mode
switch, staff role picker, pickup-time selection) where only the *active*
state gets the accent background.

That contrast fix (text on `blush-pink`/`soft-peach` now uses
`--color-warm-cream`) is what made trying further palettes cheap: swapping
the 4 token values alone is enough as long as `--color-warm-cream` stays
the lightest of the 4 and `--color-dark-charcoal` stays the darkest — the
20 fixed call sites don't need touching again for a new palette that keeps
that shape.

**Current palette — "British Racing"**, chosen after comparing several
directions live (an "Ocean" teal palette, a warm "Sunset" palette, and
English/heritage-styled options — "British Racing", "English Tea House",
"Country Garden" — shown side by side in the running app before picking):
- `--color-blush-pink: #1b4332` (racing green) — primary
  interactive/accent color (buttons, badges, nav highlight)
- `--color-soft-peach: #7b2d26` (burgundy) — secondary accent (decorative
  blobs, selected-state highlights)
- `--color-warm-cream: #f5f0e6` (ivory cream) — page background (lightest
  token)
- `--color-dark-charcoal: #2b2b2b` (near-black charcoal) — primary text
  color and dark-surface backgrounds (darkest token)

Unlike the first custom palette, this one keeps a light background (ivory,
not sage), so it reads closer to the assignment's original light-background
assumption — verified live across student screens (menu, cart) and the
sign-in screen with no new contrast issues.

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

## Implementation Decision: Visual redesign ("Direction A — Soft & Playful")

Not required by the assignment (NFR-02 only mandates the exact colors and
fonts, not a specific visual treatment). The student asked for a more
modern, animated UI with custom food imagery, so two full UI direction
mockups were drafted (Direction A: rounded cards, bouncy motion,
illustrated food medallions; Direction B: list rows, thin rules, charcoal
used boldly) and reviewed with the student, who chose Direction A.

Implemented across the student-facing screens (Menu, Cart, Food Item
Details, Pickup Time, Order Confirmation): rounded `24px` cards, a shared
`FoodIllustration` component (flat-vector SVG icons per menu item, with a
generic fallback for items without a designed icon — matters because the
menu is admin-editable via Menu Management, so new items must degrade
gracefully), a floating cart summary bar on Menu, a bouncy checkmark +
confetti + corner-bracket QR frame on Order Confirmation. The Kitchen
Dashboard, Menu Management, and Pickup Verification screens were
deliberately left as-is — `ui-ux.md` requires those to stay scannable and
free of decoration for rush-hour staff use, and that constraint doesn't
change just because the student-facing screens got a redesign.

**Real photography — resolved.** The student located the photos in their
own Downloads folder (already saved there from browsing), so they were
copied into `frontend/public/food/` instead of needing generation. A
`FOOD_IMAGES` lookup (`shared/lib/foodImages.ts`) maps menu item name to
photo path; `FoodIllustration` checks it first and falls back to the
vector icon for any item without a mapped photo (still matters for future
admin-added items via Menu Management). Club Sandwich's vector icon was
replaced by its real photo directly. Six new menu items were added to
`prisma/seed.ts` to use the rest of the photos the student provided
(Matcha Chiller, Cherry Tart, Blueberry Shake, Loaded Tater Tots, Chicken
Shawarma Bowl, Creamy Cajun Alfredo) — an **Implementation Decision**, not
an assignment requirement: the case only requires *a* menu, not these
specific items or this count.

**Menu-card treatment — iterated twice, currently "Clean Tile".** First
round: three candidate directions were mocked up (full-bleed top photo, hero
photo-as-card overlay, and a playful "polaroid" tilt); the student chose
polaroid tilt and it was implemented and shipped. Second round: the student
asked to see other directions and moved away from polaroid tilt — three more
candidates were mocked up (flat no-tilt "Clean Tile", a dense "Compact Row"
list, and a color-framed "Framed Accent"); the student chose Clean Tile,
which replaced polaroid tilt as the current implementation across Menu, Food
Item Details, and Cart.

Clean Tile: a flat rounded-16px card with the photo filling the top and a
slim caption bar below (name, price, small circular "+" button) — no tilt,
no floating badges, minimal shadow. `FoodIllustration`'s `variant="rect"`
prop (added for the earlier polaroid round) still does the same job: the
same photo/icon-fallback lookup renders as a plain rectangle instead of a
circle, no per-direction changes needed there. The Cart page's compact row
now uses a small flat rounded-square thumbnail (dropped the tilt it had
under polaroid, for visual consistency with Clean Tile's flat style).

A layout bug surfaced while wiring Clean Tile into the Cart page: passing
`variant="rect"`'s className (which carries an inline `width: 100%`) directly
onto a flex-row child stretched the thumbnail to the row's full width,
because percentage widths resolve directly against a flex container's
definite width when there's no intermediate shrink-wrapped wrapper. Fixed by
wrapping the thumbnail in a fixed-width (`w-14`) div inside the flex row —
the Menu grid and Food Item Details page were unaffected since their
containers (a CSS grid cell, a block-level card) give `width: 100%` a
different, correct sizing context.

**Original four items now have real photos too.** The student supplied three
more photos (biryani, burger, juice) to replace the vector icons for the
original menu items, completing photo coverage across all 10 items.
`FOOD_IMAGES` gained a `position` (CSS `object-position`) and optional
`scale` field per photo, since a plain center-crop `object-cover` doesn't
suit every source photo: two drink shots (Matcha Chiller, Blueberry Shake)
are styled with a lot of surrounding negative space, so a plain center crop
mostly showed background instead of the drink — `position` was tuned per
photo to frame the actual subject. The supplied biryani photo also turned
out to have a checkerboard pattern baked into its corners (its original PNG
transparency was flattened badly when it was saved as a `.jpg`, since jpg
has no alpha channel) — since the plate is circular, `scale` zoomed the crop
in enough to push those checkerboard corners out of frame without needing to
re-edit the source image at the time.

**Cropping strategy tried `object-contain`, then reverted — settled on tuned
`object-cover`.** After the crop-position tuning above, the student asked
for zero cropping, so `FoodIllustration` was switched to `object-contain` on
a soft-peach backdrop (whole photo always visible, mismatched aspect ratios
letterboxed in brand peach instead of cropping). Seeing it rendered, the
student didn't want the letterbox bars either — they wanted the tile filled
edge-to-edge with just the dish (closer to isolated product photography, the
reference they gave being a competitor's menu UI — only the generic "full,
uncropped food shot" idea was taken from that reference, not its branded
napkin texture, ribbon price tags, or logo marks, which belong to that
brand). So cropping strategy reverted to `object-cover`, but with the
per-photo `position`/`scale` tuning restored and pushed further: each photo
now zooms in enough that the crop shows mostly the dish itself and
excludes most of the surrounding props/background, rather than just
avoiding cutting the subject off. `FOOD_IMAGES` carries `position` and
`scale` again. The chicken-biryani source photo's checkerboard corners (see
above) no longer need a `scale` workaround at all — the source file itself
was permanently re-cropped to remove them during the `object-contain`
detour, so it just uses a plain `object-cover` with no photo-specific
tuning now.

**Visual redesign — reverted to bare scaffold, then settled on "Direction
A" layout.** After trying the polaroid tilt, comparing it against several
other mocked-up directions, and iterating on the photo cropping, the student
asked to see every version tried so far side by side (the original
pre-redesign scaffold, the SVG-icon/photo "Direction A" layout, polaroid
tilt, and Clean Tile). First pick was the plain original scaffold (no
illustration at all), briefly implemented across all three screens for
consistency. After one more look at the options with photos rendered in,
the student picked "Direction A" instead: rounded-24px card, a centered
circular photo (`FoodIllustration` in its default `variant="circle"`), name
and price below, description, and a full-width "Add to cart" button —
applied consistently across Menu, Cart (`size={48}` inline in the row), and
Food Item Details (`size={96}` centered). This is the design that's current
now. `FoodIllustration`/`FOOD_IMAGES` are back in active use for all three
screens.

**Custom pickup time UI.** `PickupTimePage.tsx` added a fourth option,
"Write my own time" ("custom" in `PickupTime`), which reveals a minutes
input capped visually at 180 (matching the backend's real enforcement — see
`backend.md`). `CartContext` tracks `customPickupMinutes` alongside
`pickupTime`, clearing it whenever a non-custom option is chosen, and
`confirmOrder` refuses to submit a custom pickup with no minutes set.
Display everywhere pickup time is shown (confirmation, order history,
kitchen dashboard) goes through `formatPickupTime()` in `labels.ts`, which
renders "In N min" for a custom order instead of a fixed label.

**Kitchen Dashboard: interactive action buttons + cancel.** The "Mark X"
control was a thin bordered pill with 12px text — functional but didn't
read as a button, per direct feedback. Restyled as a filled pill (racing
green background, cream text, small arrow icon, hover/tap scale via
Framer Motion) to match the button treatment used elsewhere in the app
(e.g. `PickupTimePage`'s "Confirm Order"). Added a "Cancel" action next to
it — a red-outlined pill, shown only while the order is still cancellable
(`CONFIRMED`/`PREPARING`, mirroring the backend's `CANCELLABLE_STATUSES`),
calling the new `POST /orders/:id/cancel` endpoint. Not an assignment
requirement; see `requirements.md`/`backend.md` for the `CANCELLED` status.

**Order Tracking — "Status Hero" implemented.** Of the three mocked-up
directions (Live Progress, Timeline Cards, Status Hero), the student picked
Status Hero. `OrderTrackingPage.tsx` was rewritten around a single large
icon in a soft/solid circle (color and icon shape keyed off `order.status`
via a `StatusIcon` component and a `STATUS_CONTENT` label/subtitle map),
bold status title, friendly subtitle, and a compact 4-segment progress bar
below (filled up to the current stage) instead of the old row of 16px dots.
The `ready` status gets the "highly noticeable" treatment `ui-ux.md`
requires: a looping pulse/scale animation on the icon circle and a confetti
burst reusing the same pattern as `OrderConfirmationPage.tsx`. `cancelled`
(new since the Kitchen Dashboard cancel feature) gets its own red-toned
icon/circle and skips the progress bar entirely, since cancellation doesn't
fit on a "how far along" scale. The manual "Refresh status" button was
kept — auto-polling was part of the *Live Progress* direction, which wasn't
chosen, so it wasn't added here to avoid scope creep beyond the picked
design.

**Bug fix: "Tracking" nav link went to Menu instead of the order.** The
bare `/tracking` route (the nav bar's "Tracking" link, as opposed to
`/tracking/:orderId`) resolved which order to show purely from `lastOrder`
in `CartContext` — in-memory state set only at the moment an order is
confirmed. Any full page reload (or, per the student's report, navigating
to Order History and back after one) loses it, and the page had no
fallback: `targetId` came back `null` and it redirected straight to
`/menu` with no explanation. Fixed in `OrderTrackingPage.tsx` by fetching
`GET /orders` (already sorted newest-first by the backend) and using the
most recent order when there's no route param and no `lastOrder` — the
page now shows a brief "Loading..." while resolving instead of silently
bouncing away. Only redirects to `/menu` now if the student genuinely has
no orders at all.

**Password visibility toggle.** Added a shared `PasswordInput` component
(`shared/components/PasswordInput.tsx`) — a text/password input with an
eye icon that toggles `type="password"`/`type="text"`, so what's typed can
be checked before submitting. Used by `LoginPage.tsx` (sign in and
register) and `CreateStaffAccountPage.tsx`. Not an assignment requirement;
built as one shared component rather than duplicating the toggle logic in
both places, per the "avoid duplicated logic" engineering rule.

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
