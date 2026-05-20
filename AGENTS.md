# Agents.md

## Project Overview

Shopping cart application with product listing and fake authentication.

---

## Stack

- **Framework:** React + TypeScript
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Unit/Integration Testing:** Vitest
- **E2E Testing:** Playwright

Use always pnpm as package manager.

---

## TDD Workflow (Mandatory)

All development MUST follow this cycle — no exceptions:

1. **Red** — Write the test first. Run it. It must fail.
2. **Green** — Write the minimum code to make the test pass. Run tests. All must pass.
3. **Refactor** — Clean up the code. Tests must remain green.

> Never write implementation code before a failing test exists.

---

## File Organization

src/
├── shared/
│ ├── types/
│ ├── utils/
│ ├── constants/
│ ├── components/
│ ├── strategies/
│ └── hooks/
├── features/
│ ├── product-catalog/
│ │ ├── components/
│ │ ├── services/
│ │ ├── hooks/
│ │ └── models.ts
│ ├── shopping-cart/
│ │ ├── components/
│ │ ├── services/
│ │ ├── hooks/
│ │ └── models.ts
│ └── auth/
│ ├── components/
│ ├── services/
│ ├── hooks/
│ └── models.ts
├── context/
│ ├── CartContextValue.ts
│ ├── CartContext.ts
│ └── useCart.ts
├── infrastructure/
│ ├── sentry.ts
│ └── SentryErrorBoundary.ts
└── test/
└── setup.ts

### Scope Determines Structure (Absolute Rule)

| Scope                  | Location                      |
| ---------------------- | ----------------------------- |
| Used by 2+ features    | `src/shared/` — mandatory     |
| Used by 1 feature only | `src/features/X/` — mandatory |

**This rule is absolute and non-negotiable. No exceptions.**

---

## Code Rules

### 1. Path Aliasing

Always use aliases for imports. Never use relative paths across features.

```ts
// tsconfig.app.json and vite.config.ts
"@shared/*"         → "src/shared/*"
"@features/*"       → "src/features/*"
"@infrastructure/*" → "src/infrastructure/*"
```

```ts
// ✅ Correct
import { useCart } from '@shared/hooks/useCart'

// ❌ Wrong
import { useCart } from '../../shared/hooks/useCart'
```

### 2. tsconfig.app.json — Exclude Test Files

Test files must be excluded from the app TypeScript compilation:

```json
{
	"exclude": ["src/**/*.test.ts", "src/**/*.test.tsx", "src/test/**"]
}
```

### 3. No allowExportNames Workaround

Never use `allowExportNames` as a workaround. Fix the actual export/import issue instead.

### 4. Husky Setup Order

Git must be initialized before Husky. Always follow this order:

```bash
git init
npx husky init
```

---

## Global State

The shopping cart MUST use a global state solution via React Context.
The context lives in `src/context/` and consists of exactly 3 files:

- `CartContextValue.ts` — TypeScript interface/type for the context value
- `CartContext.ts` — Context creation and Provider component
- `useCart.ts` — Custom hook to consume the context

---

## Features

### product-catalog

- Display list of available products
- Each product shows name, price, image and add-to-cart button

### shopping-cart

- Fully functional cart (add, remove, update quantity)
- Show total price
- Persist state globally across the app

### auth

- Fake authentication (no real backend). Persistent between pages refresh
- Login / logout flow
- Protect routes if user is not authenticated

---

## My rol as student

- I will give you instructions and requisites about the project.
- You will generate the code based on my requirements.
- I'll review any code changes, verify and if it works we'll continue to the next point.

## Agent Instructions

- Do not generate code i didn't ask for.
- When I demand a test, only generate the test.
- When I request and implementation, only generate the implementation
- Always follow the TDD cycle before writing any implementation
- Always check scope before placing a file — shared vs feature-local
- Always use path aliases, never relative cross-feature imports
- Always use strict typescript
- Testing Library with accesible querys
- Always run `git init` before `npx husky init`
- Never place test files inside the TypeScript app compilation scope
- The cart global state must be implemented via the context pattern described above
- Each feature is self-contained; cross-feature dependencies must be extracted to `src/shared/`
- Do not assume anything, if anything isn't clear ask before proceeding.
