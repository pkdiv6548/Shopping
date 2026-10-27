# Shopping Mart

Premium bilingual fashion storefront built with **HTML5, CSS3 and vanilla JavaScript**. Supabase provides authentication and database services. Vercel deploys this as a static site; there is no PHP host, Node application server, React, Next.js, or TypeScript runtime in production.

## Deploy
Vercel project uses the root directory and `vercel.json` static configuration. Pushes to `main` trigger deployment when Git integration is enabled.

## Supabase
Browser client uses the Supabase publishable key. This key is designed for browser use and is only safe with correctly configured grants and Row Level Security. Never expose service-role/secret keys.

The app uses:
- `sm_products` for the product catalog (matching local product slugs)
- `sm_wishlists` for each signed-in user's favourites
- `sm_cart_items` for each signed-in user's bag

## Current behavior and constraints
- English and Hindi storefront.
- 20 local presentation products with version-controlled SVG imagery.
- User-specific bag/favourites are intended to sync through Supabase; guest data is stored locally.
- Checkout is demo-only and does not take payments.
- No paid APIs or services are required by the storefront.
- Product slugs in Supabase must match `js/products.mjs`; database policies must be reviewed before production use.

## Research-aligned plan
See [docs/implementation-plan.md](docs/implementation-plan.md) for the product direction, user journeys, constraints and release gates.

## Validation
Run `npm run build` to syntax-check JavaScript and validate local pages/assets and Vercel configuration.


## Zero-budget development rules

This is a demo/test storefront. Keep improvements within the existing free-tier limits and review current quotas before adding data-heavy features.

- Keep checkout clearly demo-only until payment, order, inventory, and server-side verification are intentionally implemented and tested.
- Use only the Supabase publishable key in browser code; never expose service-role or secret keys.
- Preserve Row Level Security and user-scoped access for cart and wishlist records.
- Prefer local assets and existing browser APIs before adding new services or dependencies.
- Run `npm run build` before publishing changes.

See [the zero-budget plan](docs/zero-budget-plan.md) for priorities and release checks.
