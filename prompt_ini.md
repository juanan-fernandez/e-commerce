Generar Agents.md teniendo en cuenta las siguientes instrucciones. Genera todo el resultado en inglés en una caja de código.

Proyecto de carrito de la compra con listado de productos y autenticación fake.

## STACK

El stack a utilizar es React con typescript + tailwind + vite + vitest + playwright

El carrito debe usar un estado global y ser completamente funcional.

## TDD MANDATORY

El desarrollo debe ser TDD orientado:

1. Escribir primero los tests => ejecutar => test debe fallar (red)
2. Implementar código mínimo para pasar tests.
3. Ejecutar test => tests must pass (Green)
4. Refactor keeping tests green

## FILE ORGANIZATION

`src/shared/` => used by multiple features
`src/features/X/` => specific to X feature

    Example:
    	src/
    		shared/{types, utils, constants components, strategies, hooks}/
    		features/{product-catalog, shopping-cart, auth}/{components, services, hooks, models.ts}
    		context/ # 3 files: CartContextValue.ts, CartContext.ts, useCart.ts
    		infrastructure/# sentry.ts, SentryErrorBoundary.ts
    		test/setup.ts

**"Scope determines structure"**

- Code used by 2+ features → MUST go in global/shared directories
- Code used by 1 feature → MUST stay local in that feature
- NO EXCEPTIONS - This rule is absolute and non-negotiable

## CODE RULES

1. Utilize aliasing for cleaner imports (e.g., `@features`, `@shared`, `@infrastructure`)
2. In tsconfig.app.json exclude any file refered to tests [src/**/*.test.ts, src/**/.test.tsx, src/test/**]
3. Never use allowExportNames workaround
4. Husky: git init BEFORE husky init
