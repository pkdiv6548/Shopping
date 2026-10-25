-- Make cart rows variant-aware so the same product can be saved in multiple sizes.
-- Existing rows are migrated to the first available variant for their product.

ALTER TABLE public.sm_cart_items
  ADD COLUMN IF NOT EXISTS variant_id uuid;

UPDATE public.sm_cart_items AS cart
SET variant_id = (
  SELECT variant.id
  FROM public.sm_variants AS variant
  WHERE variant.product_id = cart.product_id
  ORDER BY (variant.stock_quantity > 0) DESC, variant.size_label ASC
  LIMIT 1
)
WHERE cart.variant_id IS NULL;

ALTER TABLE public.sm_cart_items
  ALTER COLUMN variant_id SET NOT NULL;

ALTER TABLE public.sm_cart_items
  DROP CONSTRAINT IF EXISTS sm_cart_items_pkey;

ALTER TABLE public.sm_cart_items
  ADD CONSTRAINT sm_cart_items_pkey
  PRIMARY KEY (user_id, product_id, variant_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'sm_cart_items_variant_id_fkey'
      AND conrelid = 'public.sm_cart_items'::regclass
  ) THEN
    ALTER TABLE public.sm_cart_items
      ADD CONSTRAINT sm_cart_items_variant_id_fkey
      FOREIGN KEY (variant_id)
      REFERENCES public.sm_variants(id)
      ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_sm_cart_items_variant_id
  ON public.sm_cart_items (variant_id);

