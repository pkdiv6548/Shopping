# Shopping WebApp — QA and Security Acceptance Checklist

This checklist turns the Shopping WebApp research priorities into repeatable release checks. It is a test plan, not evidence that every item has already passed.

## Scope and verified baseline

- Keep the current static HTML/CSS/Vanilla JavaScript architecture; do not rewrite the stack as part of QA.
- Checkout is **demo-only**. No real payment processing or production order placement is enabled.
- Cart quantity unit tests run as part of `npm run build`.
- The Supabase project currently has RLS enabled on all eight `sm_*` tables. Policies were inspected on 2026-10-27; this does not replace adversarial tests using separate user sessions.
- Supabase Security Advisor currently reports **Leaked Password Protection Disabled**. This remains an open dashboard action.

## Release gate A — automated checks

- [ ] Run `npm run build`; require all Node tests, JavaScript syntax checks, and static-site validation to pass.
- [ ] Review required GitHub Actions checks for the proposed PR and require the repository Build check to pass before merge.
- [ ] Production deployment/browser verification is a separate release activity. Do not access or modify Vercel accounts, settings, deployments, or integrations from this workflow; if deployment status is unavailable or reports an account/quota issue, record it as unverified and do not treat it as a code-build result.
- [ ] Record commit SHA, PR link, test result, and any unresolved warnings.

## Release gate B — storefront and responsive UI

Run on the deployed site in a real browser; record browser/version and viewport size.

- [ ] Open Home, category/collection, product detail, search, cart, wishlist, account, and checkout pages directly by URL; no blank page or uncaught console exception.
- [ ] Test a 320px-wide viewport and common mobile/tablet/desktop widths; no critical horizontal overflow or clipped primary actions.
- [ ] Verify English/Hindi toggle changes visible page copy consistently and remains usable after navigation.
- [ ] Verify product images load, have meaningful alternative text, and do not depend on unavailable third-party image hosts.
- [ ] Verify search, category/price/colour filters, sort, empty states, loading states, and error feedback.
- [ ] Verify keyboard focus is visible; dialogs/menus can be operated without a mouse; form fields have labels and errors are understandable.

## Release gate C — cart and wishlist

- [ ] Add a product with a valid variant; verify the selected size/variant is shown in the cart.
- [ ] Reject quantity values below 1, above 99, fractional values, non-numeric values, and coerced values such as booleans/arrays/objects.
- [ ] Never allow cart quantity to exceed current available stock; test out-of-stock and stock-reduced cases.
- [ ] Increase/decrease quantity, remove one item, clear cart if supported, refresh, and navigate away/back; verify persistence and totals.
- [ ] Add/remove wishlist items, refresh, and navigate away/back; verify persistence.
- [ ] Test guest state and signed-in state separately; ensure guest data does not appear in another user's account.

## Release gate D — authentication and data isolation

Use two separate test accounts (User A and User B) and a logged-out session. Do not use real customer data.

- [ ] Confirm logged-out users can read only the intended public catalog data.
- [ ] Confirm User A can read/write only their own cart and wishlist rows.
- [ ] Attempt to read, update, or delete User A's cart/wishlist rows while authenticated as User B; requests must be denied or return no User A data.
- [ ] Confirm order and order-item reads are scoped to the authenticated owner.
- [ ] Confirm draft/archived products and their variants/images are not exposed through public catalog queries.
- [ ] Verify no service-role secret or other privileged key appears in client files, source maps, network responses, or logs.
- [ ] Re-run Supabase Security Advisor; enable Leaked Password Protection in Supabase Dashboard → Authentication → Settings, then confirm the warning is gone.

## Release gate E — demo checkout

- [ ] Clearly label checkout and resulting order as demo-only; do not imply payment was taken.
- [ ] Submit with an empty cart; checkout must not create a demo order.
- [ ] Double-click/repeat-submit checkout; only one demo order should be created for a single action.
- [ ] Reduce stock after adding to cart, then attempt checkout; the cart must be corrected and the user asked to review it before continuing.
- [ ] Verify demo order is saved only in the intended demo storage, the cart clears after success, and failure to save does not silently report success.
- [ ] Confirm no real payment, shipment, or inventory decrement is triggered by the demo flow.

## Release gate F — performance and accessibility targets

Measure with an agreed production-like run; these are targets, not currently measured results.

- [ ] LCP ≤ 2.5 seconds, INP ≤ 200 milliseconds, CLS ≤ 0.1 on representative mobile/desktop sessions.
- [ ] No critical accessibility failures; target WCAG 2.2 AA.
- [ ] Verify images are appropriately sized and cached; avoid shipping unnecessary JavaScript or large assets.

## Current status (2026-10-27)

### Verified
- Cart quantity rules have Node regression tests and are part of the build command.
- Build check and both Vercel checks passed for PR #16 before merge; its change is merged to `main`.
- RLS is enabled on eight `sm_*` tables, each with one policy visible in the current policy inventory.
- Current policy inventory: public read policies for active catalog records; authenticated owner-scoped cart/wishlist policies; owner-scoped order/order-item reads.

### Not yet verified / open
- Live browser end-to-end tests have not been completed in this workflow.
- Cross-user RLS negative tests using two authenticated sessions have not been run.
- Responsive and accessibility audit results have not been measured.
- Leaked Password Protection remains disabled per the latest Security Advisor result.
- Vercel is explicitly out of scope for this workflow because the connected integration may belong to a different account. Do not interact with Vercel; its status is not a substitute for GitHub Actions build validation or live browser testing.


### Read-only Supabase policy inventory (2026-10-27)

Project ref: `dbenwifjhdqhiznowncs`. The database policy catalog was queried read-only; no schema, data, or Auth settings were changed.

- `sm_cart_items`: one `ALL` policy for `authenticated`; both `USING` and `WITH CHECK` require `auth.uid() = user_id`.
- `sm_wishlists`: one `ALL` policy for `authenticated`; both `USING` and `WITH CHECK` require `auth.uid() = user_id`.
- `sm_orders`: authenticated users may `SELECT` only rows with `user_id = auth.uid()`; no client insert/update/delete policy was present.
- `sm_order_items`: authenticated users may read an item only when its parent order belongs to `auth.uid()`; no client write policy was present.
- `sm_products`: public catalog reads are restricted to `status = 'active'`.
- `sm_variants` and `sm_product_images`: public reads are restricted to records whose parent product is active.
- `sm_categories`: public read policy allows category rows.
- All eight tables report RLS enabled. The inspected policy predicates are consistent with owner-scoped cart/wishlist access and active-only public catalog access, but **this is not proof of cross-user isolation**. Two authenticated sessions still need adversarial read/update/delete tests.
- Security Advisor still reports `auth_leaked_password_protection` as WARN. This is a Supabase Auth setting, not a repository code change; it was not changed during this audit.
- Performance Advisor lists six unused indexes. No index was dropped because advisor observations alone do not establish that removal is safe.

### QA status clarification (2026-10-27)

- Verified by read-only inspection: policy definitions and RLS-enabled flags listed above.
- Not verified: live User A/User B negative tests, browser checkout flow, responsive visual measurements, and accessibility measurements.
- No Supabase schema/data/Auth settings were modified during this audit.
