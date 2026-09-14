# University Cafeteria Pre-Order App — Claude Code Instructions

## Project purpose

This project is a university software engineering project for a Cafeteria Pre-Order App.

The system allows students to pre-order cafeteria food through a mobile/web application. Cafeteria staff manage menu items, availability, and pickup times. Payment may be handled by cash or wallet. The main goal is to reduce queue time and manage rush-hour demand.

## Source of truth

The university assignment requirements are the primary source of truth for the academic scope.

Required stakeholders:
- Students
- Chef
- Cafeteria Staff
- Cafeteria Manager
- Faculty Members

Required functional requirements:
1. Separate User and Staff Member modes.
2. Flexible pickup time selection: immediately, within 30 minutes, or within one hour.
3. Confirmed orders are sent directly to the cafeteria kitchen dashboard.
4. Users can track order status and receive a notification when an order is ready.
5. Each confirmed pre-order has a unique QR code/order ID for pickup verification.

Required non-functional requirements:
1. Performance: web application should load within 2 seconds under normal operating conditions.
2. Interface and usability: sleek, minimalist interface using the assignment's specified visual direction and colors.
3. Security/authorization: only authorized cafeteria staff or administrators can modify menu items, prices, and availability.

Identified risks:
- Fake orders by students.
- Server crash or severe slowdown during rush hours.

Associated umbrella activities:
- Fake orders: Risk Management.
- Rush-hour server failure: Technical Review.

## Academic integrity

Do not silently add requirements and present them as assignment requirements.

When introducing an implementation decision that is not explicitly specified by the assignment, label it as:
- Implementation Decision
- Assumption
- Optional Enhancement

Keep the core implementation traceable to the assignment.

## General engineering rules

- Prefer simple, maintainable architecture over unnecessary complexity.
- Do not introduce microservices unless explicitly required.
- Keep business rules in the appropriate application layer.
- Validate user input at system boundaries.
- Enforce authorization on the server/backend, not only in the UI.
- Never expose secrets in frontend code or source control.
- Write tests for important business rules.
- Keep naming consistent throughout the project.
- Avoid duplicated business logic.
- Avoid premature abstractions and over-engineering.
- Keep code clean and production-like while remaining appropriate for a university project.
- Never write comments in code. Rely on clear naming and small, focused functions instead.

## Documentation rules

Every major implementation decision should be documented in the relevant Claude reference file.

Do not create documentation that contradicts the assignment.

## Before changing code

1. Read this file.
2. Read the relevant files under `claude/`.
3. Inspect the existing project structure.
4. Identify which assignment requirement the change supports.
5. Implement the smallest clean solution.
6. Run relevant tests and validation.
7. Update documentation if the architecture or requirements changed.

## Definition of done

A feature is complete when:
- Its requirement is implemented.
- Validation and authorization are handled appropriately.
- Relevant tests exist or the reason for no test is clear.
- The UI handles loading, empty, success, and error states where applicable.
- No secrets are committed.
- No unrelated code is changed.
- The implementation remains consistent with the architecture.
