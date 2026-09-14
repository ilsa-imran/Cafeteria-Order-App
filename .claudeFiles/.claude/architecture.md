# Architecture Reference

## Architectural goal

Build a simple, understandable architecture that demonstrates good software engineering practices without unnecessary complexity.

## Recommended logical architecture

Use a layered application architecture:

```text
Presentation Layer
        |
        v
Application / API Layer
        |
        v
Business Logic Layer
        |
        v
Data Access Layer
        |
        v
Database
```

External services may be connected through clearly isolated integration modules.

## Main domains

- Authentication and authorization
- Users
- Menu
- Orders
- Pickup times
- Kitchen processing
- Order tracking
- Pickup verification
- Notifications

## Core flow

```text
Student
  |
  v
Browse Menu
  |
  v
Select Items
  |
  v
Select Pickup Time
  |
  v
Confirm Order
  |
  v
Generate Order ID + QR
  |
  v
Kitchen Dashboard
  |
  v
Prepare Order
  |
  v
Mark Ready
  |
  v
Student Receives Notification
  |
  v
Pickup Verification
```

## Staff flow

```text
Staff Login
   |
   +--> Kitchen Dashboard
   |       |
   |       +--> View Orders
   |       +--> Update Status
   |       +--> Verify Pickup
   |
   +--> Menu Management
           |
           +--> Add Item
           +--> Edit Item
           +--> Remove Item
           +--> Update Price
           +--> Update Availability
```

## Authorization boundary

Authorization must be enforced by the backend/application layer.

The frontend may hide controls for convenience, but hiding a button is not a security mechanism.

## Architecture constraints

- Keep the system modular.
- Avoid circular dependencies.
- Keep database access isolated.
- Do not put business rules directly into UI components.
- Do not duplicate order-status rules across frontend and backend.
- Keep external integrations replaceable.

## Scalability

The assignment identifies rush-hour server failure as a risk.

The first response should be:
- efficient queries,
- pagination where appropriate,
- database indexes,
- caching only where justified,
- load testing,
- monitoring,
- technical review.

Do not introduce Kubernetes or microservices solely because the project mentions scalability.
