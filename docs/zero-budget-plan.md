# Zero-Budget Shopping Mart Plan

This repository is a **demo/test fashion storefront**, not a production payment store. The goal is to improve it without adding paid subscriptions or services.

## Budget rules

- Keep the site as a static HTML/CSS/JavaScript project deployed to the existing Vercel project.
- Keep the existing Supabase project on its Free plan; monitor its current quotas and avoid paid-only features.
- Never add a Supabase service-role key or other secret to browser code.
- Keep checkout explicitly demo-only until a payment provider and its costs, legal requirements, and server-side verification are intentionally approved.
- Prefer local assets, native browser APIs, and existing dependencies before introducing another service.
- Do not promise real email delivery, shipping rates, order placement, or payment processing unless the corresponding integration exists and is tested.

## Delivery order

### P0 — Protect the current demo
1. Keep the existing storefront and current Supabase connection intact.
2. Run `npm run build` before every change.
3. Confirm authentication, guest cart, wishlist, and bilingual UI still work.
4. Keep checkout messaging clear: no payment is collected and no real order is placed.

### P1 — Reliability and accessibility
1. Respect the operating system's reduced-motion preference.
2. Test keyboard focus, labels, mobile navigation, and touch controls.
3. Validate all local page/asset references with the existing build validator.
4. Test the app with Supabase unavailable and ensure errors are understandable.
5. Check mobile widths and prevent horizontal overflow.

### P2 — Storefront improvements
1. Improve product discovery using the current local catalogue: category, query, and price sorting.
2. Keep cart/wishlist persistence graceful for guests and signed-in users.
3. Ensure unavailable variants cannot be added to the bag.
4. Improve empty, loading, and error states without adding paid dependencies.

### P3 — Only after core flows are verified
1. Add a real admin workflow only if the existing backend schema and authorization policies can support it safely.
2. Add real checkout only after choosing a payment provider and implementing server-side price, stock, order, and payment verification.
3. Consider PWA/offline support only after defining which features must work offline. A cached shell alone does not make authentication or checkout work offline.

## Free-tier operating checklist

- Review Vercel and Supabase usage/quotas in their dashboards.
- Keep database access protected by Row Level Security.
- Use only the Supabase publishable key in browser code; it is not a replacement for RLS.
- Avoid unnecessary image uploads and oversized assets.
- Do not store payment card details.
- Use demo/test data until a production launch checklist is complete.

## Release checklist

- [ ] `npm run build` passes.
- [ ] Homepage, collection, product, search, account, wishlist, cart, and checkout pages load.
- [ ] English/Hindi switching works on both the homepage and subpages.
- [ ] Guest cart and wishlist persist after refresh.
- [ ] Signed-in cart and wishlist use the authenticated user's records only.
- [ ] No secret keys are committed.
- [ ] Checkout continues to clearly state that it is a demo.
- [ ] Mobile, keyboard, and reduced-motion checks pass.
- [ ] Vercel deployment is inspected after the commit; a Git commit alone does not prove the live deployment succeeded.
