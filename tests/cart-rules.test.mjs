import test from "node:test";
import assert from "node:assert/strict";
import { isValidCartQuantity } from "../js/cart-rules.mjs";

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
