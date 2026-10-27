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
