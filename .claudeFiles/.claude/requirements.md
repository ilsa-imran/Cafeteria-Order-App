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

### NFR-03 Security and authorization

Only authorized cafeteria staff or administrators shall be able to add, modify, or remove menu items, prices, and availability.

## Scope control

Do not treat the following as mandatory unless separately approved:
- Online payment processing
- Wallet integration
- Push notifications
- Delivery
- Loyalty programs
- Reviews
- Advanced analytics
- AI features
- Microservices
- Kubernetes

These may be considered optional extensions because the case mentions cash/wallet payment, but the five listed FRs and three NFRs define the core assignment requirements provided.
