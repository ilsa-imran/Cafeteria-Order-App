# Requirements Reference

## System

University Cafeteria Pre-Order App.

## Problem

Students currently face queues and congestion at the cafeteria, especially during rush hours.

## Goal

Allow students to pre-order food and select pickup timing so cafeteria staff can prepare orders efficiently and reduce queue time.

## Stakeholders

| Stakeholder | Interest |
|---|---|
| Students | Browse food, place orders, select pickup time, track orders, collect food |
| Chef | Receive and prepare confirmed orders |
| Cafeteria Staff | Manage orders, pickup verification, availability |
| Cafeteria Manager | Manage menu, prices, availability and operations |
| Faculty Members | Stakeholder affected by cafeteria efficiency |

## Functional requirements

### FR-01 User and Staff Mode

The system shall provide separate User and Staff Member modes.

### FR-02 Flexible Pickup Time

The system shall allow users to select a preferred pickup time:
- Immediately
- Within 30 minutes
- Within one hour

The purpose is to distribute orders and reduce rush-hour congestion.

> **Optional Enhancement, beyond FR-02 as written.** A fourth pickup option
> was added at the student's request — students can type their own pickup
> time instead of picking one of the three fixed options, capped at 180
> minutes (3 hours) so it can't be abused to sit indefinitely as an
> unfulfilled order. This doesn't replace or weaken the three required
> options above; it's additive. See `backend.md`/`frontend.md` for the
> `CUSTOM` pickup-time implementation.

### FR-03 Kitchen Order Processing

Confirmed user orders shall be available directly to the cafeteria kitchen dashboard so staff can view and prepare orders according to pickup time.

### FR-04 Order Tracking and Notification

Users shall be able to track order status through the web application and receive a notification when the order is ready for pickup.

### FR-05 QR Code / Order ID

The system shall generate a unique QR code for each confirmed pre-order. The QR code can be scanned at pickup, or the order ID can be entered to verify and retrieve the order.

## Non-functional requirements

### NFR-01 Performance

The web application shall load within 2 seconds under normal operating conditions.

### NFR-02 Interface and usability

The interface should follow the assignment's specified sleek and minimalist visual direction using:
- Blush pink: #F4B6C2
- Soft peach: #F8D7C4
- Warm cream: #FFF7F0
- Dark charcoal: #222222

The assignment also specifies the fonts Vanity, Arschane Regular, and Fredoka.

> **Deviation from NFR-02 (student-requested, not an assignment
> requirement).** At the student's explicit request, the implemented app
> currently uses a different color palette — racing green #1B4332, burgundy
> #7B2D26, ivory cream #F5F0E6, and near-black charcoal #2B2B2B (a heritage
> "British Racing" palette, picked after comparing it live against several
> other custom palettes) — in place of the four colors above. This was
> flagged to the student as a conflict with this documented requirement
> before making the first palette change; they chose to proceed anyway, and
> the palette itself has since been swapped again more than once at their
> request. See `frontend.md`'s "Visual direction" section for the token
> mapping and the reasoning to preserve text contrast. If graded strictly
> against NFR-02 as written, this is a known, deliberate deviation — mention
> it (and ideally get instructor sign-off) rather than letting it surface
> unexplained during grading or a demo.

### NFR-03 Security and authorization

Only authorized cafeteria staff or administrators shall be able to add, modify, or remove menu items, prices, and availability.

## Payment method (Implementation Decision, not one of the five FRs)

> The case description states "Payment can be cash or wallet," but this
> was originally treated as scope-out background context rather than a
> requirement to build, since it isn't one of the five FRs the assignment
> explicitly asks for. At the student's explicit request, this was
> implemented anyway to match the case narrative: students choose Cash or
> Wallet on the pickup-time screen before confirming an order, the choice
> is stored on the order (`Order.paymentMethod`, defaulting to `CASH` for
> pre-existing orders), and it's surfaced back to staff on Order
> Confirmation, Order History, and Pickup Verification — the latter shows
> "(collect at pickup)" next to Cash orders so staff know which ones still
> need physical payment collected. No actual payment processing/gateway
> integration was added — it's a recorded preference only, consistent with
> the "Online payment processing" scope-out below.
>
> **Follow-up (also student-requested): an in-app wallet balance.** Once
> Wallet existed as a payment choice, the student asked how a user would
> know their balance, and how a manager/staff member tops one up. Added:
> `User.walletBalance` (defaults to 0). Students see their balance in the
> nav bar and again on the pickup screen next to the payment options,
> with the Confirm button disabled and a message shown if the balance
> can't cover the order. Placing a Wallet order deducts the total from
> the balance in the same DB transaction as order creation (so it can't
> go negative under concurrent orders); cancelling a Wallet order refunds
> it. A new staff/admin-only "Wallet Top-up" page (`/wallet-topup`, both
> STAFF and ADMIN roles per "Cafeteria Staff" and "Cafeteria Manager" in
> the stakeholder list) looks a student up by email and adds funds —
> there's no real payment gateway behind it, staff just record that cash
> or another channel was received. This is a deeper extension than the
> case description asked for; flag it as such if graded strictly.

## Scope control

Do not treat the following as mandatory unless separately approved:
- Online payment processing (gateway integration, real money movement)
- Push notifications
- Delivery
- Loyalty programs
- Reviews
- Advanced analytics
- AI features
- Microservices
- Kubernetes

These remain optional extensions beyond the five listed FRs and three NFRs
that define the core assignment requirements. Cash/wallet *selection* (not
payment processing) was implemented per the case description — see
"Payment method" above.
