# Shopping Mart — Research-aligned implementation plan

This repository is a premium, bilingual fashion storefront built with static HTML, CSS and browser JavaScript, deployed on Vercel, with Supabase used only within Free-tier limits.

## Product direction
- Editorial fashion storefront inspired by broad patterns of Zara, H&M, Mango and Nike: campaign imagery, clean typography, strong category navigation, responsive product grids, quick discovery and low-friction bag/wishlist flows.
- Do not copy third-party branding, text, photography or proprietary page layouts. Keep Shopping Mart's own identity.
- Mobile-first, accessible, fast, keyboard-friendly and functional on current browsers.
- English and Hindi (Devanagari) are first-class languages, not partial label swaps.

## Core journeys
1. Home → campaign/category → collection → product detail.
2. Search/filter/sort → product detail → choose size → bag.
3. Guest bag/wishlist persisted locally; signed-in data synced to the current user's Supabase rows.
4. Sign up/sign in/sign out and recover gracefully from auth/network errors.
5. Demo checkout clearly states that no real payment or order is processed.
6. Empty, loading, unavailable, and error states are designed and translated.

## Delivery constraints
- Preserve separate HTML pages and the current static deployment architecture.
- Vercel Hobby and Supabase Free only; no paid APIs, payment gateway, or server-side secrets in browser code.
- Use local, version-controlled assets wherever possible; avoid unnecessary external image/font dependencies.
- Never expose Supabase service-role keys. Publishable key is only acceptable with correctly configured Row Level Security and least-privilege grants.
- Avoid collecting real payment details in demo checkout.
- Keep database queries lean and avoid introducing paid infrastructure.

## Release gates
- Build passes syntax checks and static validation.
- Product IDs/slugs are unique; all product image paths exist locally.
- All pages have viewport metadata and local links/assets resolve.
- English/Hindi toggles work on home and every subpage.
- Add/remove/update bag quantities, size variants and wishlist persist correctly.
- Anonymous users cannot read or mutate another user's private records.
- Mobile layouts pass at 320, 375, 768, 1024 and 1440 CSS pixels.
- Checkout remains demo-only.
- Vercel preview deployment is checked before merging to main.

## Phased execution
- P0: build health, broken links/assets, responsive overflow, runtime errors, cart/wishlist regressions, auth and RLS safety.
- P1: catalogue breadth and consistency, search/filter/sort, product detail content, complete Hindi translation, empty/error/loading states.
- P2: editorial polish, motion/accessibility, performance, SEO metadata, analytics-free QA and documentation.
- P3: later optional backend enhancements only after Free-tier and security review.
