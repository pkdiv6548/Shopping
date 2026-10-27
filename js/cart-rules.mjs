export function isValidCartQuantity(value) {
  if (typeof value !== "number" && typeof value !== "string") return false;
  if (typeof value === "string" && !/^\d+$/.test(value.trim())) return false;

  const quantity = Number(value);
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= 99;
}

export function reconcileCartWithStock(cart, variantById) {
  let changed = false;
  const nextCart = [];

  for (const item of Array.isArray(cart) ? cart : []) {
    const variant = variantById?.[item?.variantId];
    const stock = Number(variant?.stock_quantity);
    const available = Number.isFinite(stock) ? Math.min(99, Math.floor(stock)) : 0;

    if (!variant || available < 1) {
      changed = true;
      continue;
    }

    const requested = Number(item?.qty);
    const quantity = Number.isInteger(requested) && requested >= 1
      ? Math.min(requested, available)
      : 1;

    if (quantity !== item.qty) changed = true;
    nextCart.push({ ...item, qty: quantity });
  }

  return { cart: nextCart, changed };
}
