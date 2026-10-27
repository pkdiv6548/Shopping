export function isValidCartQuantity(value) {
  if (typeof value !== "number" && typeof value !== "string") return false;
  if (typeof value === "string" && !/^\d+$/.test(value.trim())) return false;

  const quantity = Number(value);
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= 99;
}

export function reconcileCartWithStock(cart, variantById, validProductIds) {
  let changed = false;
  const nextCart = [];
  const indexByKey = new Map();

  for (const item of Array.isArray(cart) ? cart : []) {
    if (validProductIds && !validProductIds.has(item?.id)) {
      changed = true;
      continue;
    }

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
    const key = JSON.stringify([String(item.id), String(item.variantId)]);
    const existingIndex = indexByKey.get(key);

    if (existingIndex !== undefined) {
      changed = true;
      const existing = nextCart[existingIndex];
      existing.qty = Math.min(available, existing.qty + quantity);
      continue;
    }

    indexByKey.set(key, nextCart.length);
    nextCart.push({ ...item, qty: quantity });
  }

  return { cart: nextCart, changed };
}


// Do not silently replace an unknown persisted variant with a local fallback.
// Only legacy carts with no variant ID (or the old local-default marker) may resolve
// to a product's current default variant.
export function resolveCartVariant(item, variantById, defaultVariantForProduct) {
  const variantId = String(item?.variantId || "");
  if (variantId && variantId !== "local-default") {
    return variantById?.[variantId] || null;
  }
  return typeof defaultVariantForProduct === "function"
    ? defaultVariantForProduct(item?.id) || null
    : null;
}


// Stable cart fingerprint supports short-window demo checkout idempotency.
export function createCartFingerprint(cart) {
  return JSON.stringify((Array.isArray(cart) ? cart : [])
    .filter(item => item && item.id != null && item.variantId != null)
    .map(item => [String(item.id), String(item.variantId), Number(item.qty)])
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))));
}

export function findRecentMatchingDemoOrder(orders, fingerprint, now = Date.now(), windowMs = 120000) {
  if (!Array.isArray(orders) || typeof fingerprint !== "string" || !fingerprint) return null;
  return orders.find(order => {
    if (order?.checkoutFingerprint !== fingerprint || typeof order.createdAt !== "string") return false;
    const createdAt = Date.parse(order.createdAt);
    const age = now - createdAt;
    return Number.isFinite(createdAt) && age >= 0 && age <= windowMs;
  }) || null;
}


// Reject malformed persisted demo orders before rendering dates, totals, or items.
// checkoutFingerprint remains optional for compatibility with older demo orders.
export function validateDemoOrders(value) {
  if (!Array.isArray(value)) return [];
  return value.filter(order => {
    if (!order || typeof order !== "object" || Array.isArray(order)) return false;
    if (typeof order.id !== "string" || !order.id.trim()) return false;
    if (typeof order.createdAt !== "string" || !Number.isFinite(Date.parse(order.createdAt))) return false;
    if (typeof order.total !== "number" || !Number.isFinite(order.total) || order.total < 0) return false;
    if (!Array.isArray(order.items) || order.items.length === 0) return false;
    if (order.checkoutFingerprint != null && typeof order.checkoutFingerprint !== "string") return false;
    return order.items.every(item =>
      item && typeof item === "object" && !Array.isArray(item) &&
      (typeof item.productId === "string" || (typeof item.productId === "number" && Number.isFinite(item.productId))) &&
      typeof item.name === "string" && item.name.trim().length > 0 &&
      typeof item.slug === "string" &&
      typeof item.price === "number" && Number.isFinite(item.price) && item.price >= 0 &&
      (item.size == null || typeof item.size === "string") &&
      Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= 99
    );
  });
}
