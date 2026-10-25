# Shopping Mart

A premium, bilingual fashion shopping web app inspired by editorial fashion presentation, strong product discovery, and practical product information.

## Stack
- Next.js App Router + TypeScript
- CSS Modules / design tokens
- Supabase (planned; connect only to a dedicated project)
- Vercel deployment

## Current status
The repository is being bootstrapped with a responsive demo storefront, sample catalogue, client-side search/filter/sort, wishlist and cart interactions, English/Hindi UI, motion details, and a Supabase migration starter. Checkout is demo-only; no real payments are processed.

## Run locally
```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment
Copy `.env.example` to `.env.local` and fill in the Supabase project URL and publishable key when a dedicated Shopping Mart project is ready. Do not add secret/service-role keys to browser code or commit `.env.local`.

## Supabase
SQL migration files are in `supabase/migrations/`. Apply them only to a dedicated Shopping Mart Supabase project after reviewing the schema and RLS policies. Existing projects should not be reused blindly.

## Demo disclaimer
Products, inventory, orders and checkout are demo data/flows until a dedicated backend and admin authentication are configured. This is not a production commerce system yet.
