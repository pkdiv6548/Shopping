import test from "node:test";
import assert from "node:assert/strict";
import { isValidCartQuantity, reconcileCartWithStock } from "../js/cart-rules.mjs";

test("accepts valid whole-number cart quantities", () => {
  for (const value of [1, 2, 25, 99, "1", "42", "99", " 7 "]) {
    assert.equal(isValidCartQuantity(value), true, String(value));
  }
});

test("rejects quantities outside the supported range", () => {
  for (const value of [0, -1, 100, -100, "0", "100"]) {
    assert.equal(isValidCartQuantity(value), false, String(value));
  }
});

test("rejects fractional, non-numeric, and non-finite quantities", () => {
  for (const value of [1.5, "2.2", NaN, Infinity, -Infinity, "abc", "", null, undefined]) {
    assert.equal(isValidCartQuantity(value), false, String(value));
  }
});

test("rejects values that JavaScript would otherwise coerce to numbers", () => {
  for (const value of [true, false, [], [1], {}, new Number(1), "1e1", "+1", "1.0"]) {
    assert.equal(isValidCartQuantity(value), false, String(value));
  }
});

test("keeps cart quantities unchanged when stock is sufficient", () => {
  const cart = [{ id: 1, variantId: "v1", qty: 2 }];
  const result = reconcileCartWithStock(cart, { v1: { stock_quantity: 5 } });
  assert.deepEqual(result, { cart, changed: false });
});

test("reduces quantities to available stock and the supported maximum", () => {
  const result = reconcileCartWithStock([
    { id: 1, variantId: "v1", qty: 8 },
    { id: 2, variantId: "v2", qty: 120 }
  ], {
    v1: { stock_quantity: 3 },
    v2: { stock_quantity: 150 }
  });
  assert.deepEqual(result, {
    cart: [
      { id: 1, variantId: "v1", qty: 3 },
      { id: 2, variantId: "v2", qty: 99 }
    ],
    changed: true
  });
});

test("removes missing and out-of-stock variants", () => {
  const result = reconcileCartWithStock([
    { id: 1, variantId: "missing", qty: 1 },
    { id: 2, variantId: "empty", qty: 2 },
    { id: 3, variantId: "valid", qty: 1 }
  ], {
    empty: { stock_quantity: 0 },
    valid: { stock_quantity: 4 }
  });
  assert.deepEqual(result, {
    cart: [{ id: 3, variantId: "valid", qty: 1 }],
    changed: true
  });
});

test("normalizes invalid quantities to one and flags the cart for review", () => {
  const result = reconcileCartWithStock([
    { id: 1, variantId: "v1", qty: 1.5 },
    { id: 2, variantId: "v1", qty: 0 }
  ], { v1: { stock_quantity: 5 } });
  assert.deepEqual(result, {
    cart: [
      { id: 1, variantId: "v1", qty: 1 },
      { id: 2, variantId: "v1", qty: 1 }
    ],
    changed: true
  });
});

test("merges duplicate product-variant lines and caps their combined quantity to stock", () => {
  const result = reconcileCartWithStock([
    { id: 1, variantId: "v1", size: "M", qty: 3 },
    { id: 1, variantId: "v1", size: "M", qty: 4 },
    { id: 1, variantId: "v2", size: "L", qty: 2 }
  ], {
    v1: { stock_quantity: 5 },
    v2: { stock_quantity: 8 }
  });

  assert.deepEqual(result, {
    cart: [
      { id: 1, variantId: "v1", size: "M", qty: 5 },
      { id: 1, variantId: "v2", size: "L", qty: 2 }
    ],
    changed: true
  });
});

test("removes stale cart items whose products are no longer in the catalog", () => {
  const cart = [
    { id: "removed-product", variantId: "v1", qty: 1 },
    { id: "active-product", variantId: "v2", qty: 2 }
  ];
  const result = reconcileCartWithStock(cart, {
    v1: { stock_quantity: 5 },
    v2: { stock_quantity: 5 }
  }, new Set(["active-product"]));

  assert.deepEqual(result, {
    cart: [{ id: "active-product", variantId: "v2", qty: 2 }],
    changed: true
  });
});


test("does not remap an unknown persisted variant to a fallback variant", async () => {
  const { resolveCartVariant } = await import("../js/cart-rules.mjs");
  const fallback = { id: "local-4-s", stock_quantity: 10 };
  assert.equal(resolveCartVariant(
    { id: 4, variantId: "removed-db-variant-uuid" },
    { [fallback.id]: fallback },
    () => fallback
  ), null);
});

test("allows legacy carts without a variant ID to use the current default", async () => {
  const { resolveCartVariant } = await import("../js/cart-rules.mjs");
  const fallback = { id: "local-4-s", stock_quantity: 10 };
  assert.equal(resolveCartVariant({ id: 4, variantId: "" }, {}, () => fallback), fallback);
});


test("floors fractional stock and never permits quantities above stock", () => {
  const result = reconcileCartWithStock([
    { id: 1, variantId: "fractional", qty: 3 },
    { id: 2, variantId: "string-stock", qty: 4 }
  ], {
    fractional: { stock_quantity: 2.8 },
    "string-stock": { stock_quantity: "3" }
  });
  assert.deepEqual(result, {
    cart: [
      { id: 1, variantId: "fractional", qty: 2 },
      { id: 2, variantId: "string-stock", qty: 3 }
    ],
    changed: true
  });
});

test("removes variants with negative, non-numeric, or missing stock values", () => {
  const result = reconcileCartWithStock([
    { id: 1, variantId: "negative", qty: 1 },
    { id: 2, variantId: "invalid", qty: 1 },
    { id: 3, variantId: "missing-stock", qty: 1 }
  ], {
    negative: { stock_quantity: -2 },
    invalid: { stock_quantity: "unknown" },
    "missing-stock": {}
  });
  assert.deepEqual(result, { cart: [], changed: true });
});

test("supports only the explicit legacy default marker when a variant ID is present", async () => {
  const { resolveCartVariant } = await import("../js/cart-rules.mjs");
  const fallback = { id: "default-variant", stock_quantity: 4 };
  const getDefault = () => fallback;

  assert.equal(resolveCartVariant(
    { id: 4, variantId: "local-default" }, {}, getDefault
  ), fallback);
  assert.equal(resolveCartVariant(
    { id: 4, variantId: "deleted-variant" }, {}, getDefault
  ), null);
});

test("returns null when a legacy cart has no usable default-variant resolver", async () => {
  const { resolveCartVariant } = await import("../js/cart-rules.mjs");
  assert.equal(resolveCartVariant({ id: 4 }, {}, null), null);
});

test("normalizes numeric-string quantities to numbers and caps them to the supported maximum", () => {
  const result = reconcileCartWithStock([
    { id: 1, variantId: "v1", qty: "4" },
    { id: 2, variantId: "v2", qty: "120" }
  ], {
    v1: { stock_quantity: 8 },
    v2: { stock_quantity: 200 }
  });

  assert.deepEqual(result, {
    cart: [
      { id: 1, variantId: "v1", qty: 4 },
      { id: 2, variantId: "v2", qty: 99 }
    ],
    changed: true
  });
});

test("treats infinite stock as invalid instead of allowing an unbounded quantity", () => {
  const result = reconcileCartWithStock([
    { id: 1, variantId: "infinite", qty: 1 },
    { id: 2, variantId: "nan", qty: 1 }
  ], {
    infinite: { stock_quantity: Infinity },
    nan: { stock_quantity: NaN }
  });

  assert.deepEqual(result, { cart: [], changed: true });
});

test("handles non-array cart input and malformed cart entries safely", () => {
  assert.deepEqual(reconcileCartWithStock(null, {}), {
    cart: [],
    changed: false
  });

  const result = reconcileCartWithStock([null, undefined, {}, { id: 3, qty: 1 }], {});
  assert.deepEqual(result, { cart: [], changed: true });
});


test("keeps product-variant pairs separate when IDs contain delimiter characters", () => {
  const result = reconcileCartWithStock([
    { id: "a:b", variantId: "c", qty: 2 },
    { id: "a", variantId: "b:c", qty: 3 }
  ], {
    c: { stock_quantity: 5 },
    "b:c": { stock_quantity: 7 }
  });

  assert.deepEqual(result, {
    cart: [
      { id: "a:b", variantId: "c", qty: 2 },
      { id: "a", variantId: "b:c", qty: 3 }
    ],
    changed: false
  });
});

