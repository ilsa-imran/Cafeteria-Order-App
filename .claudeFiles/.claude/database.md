# Database Reference

## Purpose

The database stores the persistent data required for ordering and cafeteria operations.

## Core data model

A conceptual model:

```text
User
 |
 +----< Order
          |
          +----< OrderItem >---- MenuItem
          |
          +---- Pickup / Verification
          |
          +---- Notification
```

## Suggested fields

### User

- id
- name
- email
- role
- createdAt
- updatedAt

### MenuItem

- id
- name
- description
- price
- availability
- createdAt
- updatedAt

### Order

- id
- orderNumber
- userId
- status
- pickupOption
- total
- createdAt
- updatedAt

### OrderItem

- id
- orderId
- menuItemId
- quantity
- unitPrice

### Notification

- id
- userId
- orderId
- type
- status
- createdAt

These are implementation suggestions, not additional assignment requirements.

## Data integrity

Use database constraints for important invariants where supported.

Examples:
- unique order number,
- valid foreign keys,
- non-negative quantities,
- required relationships.

## Indexing

Consider indexes for:
- order user ID,
- order status,
- pickup time,
- order creation time,
- menu availability.

Indexes should be justified by actual query patterns.

## Security

Do not store passwords in plain text.

If authentication is implemented locally, use a secure password hashing algorithm through a trusted library.

Do not store sensitive secrets in database seed files.
