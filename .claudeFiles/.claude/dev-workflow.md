# Development Workflow

## Before implementation

1. Read `CLAUDE.md`.
2. Read the relevant reference document.
3. Inspect the existing implementation.
4. Identify the requirement being implemented.
5. Identify risks and edge cases.
6. Make a small implementation plan.

## During implementation

- Keep changes focused.
- Reuse existing patterns.
- Avoid unnecessary rewrites.
- Validate at system boundaries.
- Keep authorization server-side.
- Add tests for important behavior.

## After implementation

Run:
- formatter,
- linter,
- unit tests,
- integration tests where relevant,
- build.

For UI changes, manually verify:
- desktop layout,
- mobile layout,
- loading,
- empty state,
- error state,
- success state.

## Merge request checklist

Before requesting review:
- requirement implemented,
- tests added/updated,
- no debug code,
- no secrets,
- no unnecessary dependencies,
- no unrelated changes,
- documentation updated if needed.

## Code review focus

Reviewers should check:
- correctness,
- security,
- authorization,
- validation,
- duplicated logic,
- maintainability,
- performance,
- accessibility,
- unnecessary complexity.

## Academic traceability

For major features, be able to answer:

```text
Which requirement does this implement?
How was it tested?
What assumption was made?
What risk does it address?
```

## Implementation Decision: Feature-based, spec-driven structure

Not required by the assignment; adopted to keep the codebase organized and each feature traceable to an FR/NFR. Applies to both `frontend/` and `backend/`.

**Feature-based folders.** Code under `src/features/<feature>/` (e.g. `menu`, `cart`, `pickup`, `order-tracking`, `kitchen-dashboard`, `menu-management`, `auth` on the frontend; `auth`, `menu`, `orders`, `pickup-verification` on the backend) instead of type-based folders (`components/`, `hooks/`, `controllers/` at the top level). Shared code lives in `src/shared/`. This keeps each feature's logic, types, and routes/components together and avoids the duplicated-business-logic problem `coding-conventions.md` warns about.

**Spec-driven.** Before implementing a feature, write or update a short spec under `specs/<feature>.md` (frontend) or `specs/<feature>-api.md` (backend) containing:
- which FR/NFR it implements (traceability, matches `academic-submission.md`),
- acceptance criteria,
- states to handle (loading/empty/success/error/disabled/unauthorized on the frontend; validation/authorization/error responses on the backend).

Implement to match the spec, not the other way around. Update the spec first if the requirement changes, matching the rule already in `.claude/README.md`.
