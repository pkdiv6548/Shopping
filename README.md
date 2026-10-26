# Shopping Mart

Premium bilingual fashion storefront built with **HTML5, CSS3 and vanilla JavaScript**. Supabase provides authentication and database services. Vercel deploys this as a static site; there is no PHP host, Node application server, React, Next.js, or TypeScript runtime in production.

## Zero-budget approach

This is currently a **demo/test storefront**. Keep development within the existing Vercel and Supabase Free-plan limits. Review current usage quotas in both dashboards before adding data-heavy features. See [the zero-budget plan](docs/zero-budget-plan.md) for implementation priorities and a release checklist.

## Deploy

Vercel project uses the repository root and `vercel.json` static configuration. Pushes to `main` trigger deployment when Git integration is enabled. Run `npm run build` locally before publishing changes.

## Supabase

Browser client uses the Supabase publishable key. This key is designed for browser use and is only safe with correctly configured grants and Row Level Security. Never expose service-role/secret keys.

The app uses:
- `sm_products` for the product catalogue (matching local product slugs)
- `sm_wishlists` for each signed-in user's favourites
- `sm_cart_items` for each signed-in user's bag

## Current limitations

- Checkout is demo-only: no payment is collected and no real order is placed.
- The storefront includes a 12-item local presentation catalogue and local SVG product/editorial illustrations.
- User-specific bag/favourites can be loaded from Supabase; guest bag/favourites use browser storage.
- The app expects product slugs in Supabase to match `js/products.mjs`.
- Newsletter signup is not connected to an email delivery service.
- Real inventory reservation, shipping labels, tax calculation, refunds, and payment verification are not production checkout features yet.

## Build validation

```sh
npm run build
```

The build checks JavaScript syntax, required pages/assets, local links, and static Vercel configuration.
