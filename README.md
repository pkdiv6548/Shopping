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

## Current limitations
Checkout is demo-only and does not take payments. Product images are hosted on Unsplash. Product catalogue is a 12-item local presentation catalogue; user-specific bag/favourites are loaded from Supabase. The app expects product slugs in Supabase to match `js/products.mjs`.
