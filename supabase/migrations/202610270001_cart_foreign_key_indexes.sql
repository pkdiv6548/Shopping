-- Add covering indexes for cart item foreign keys.
-- These indexes improve joins and parent-row update/delete checks as cart data grows.
create index if not exists sm_cart_items_product_id_idx
  on public.sm_cart_items (product_id);

create index if not exists sm_cart_items_variant_id_idx
  on public.sm_cart_items (variant_id);
