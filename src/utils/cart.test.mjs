import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTotals } from './cart.js';

test('calculateTotals', () => {
  const result = calculateTotals([{ precio: 10, cantidad: 2 }, { precio: 5, cantidad: 1 }]);
  assert.equal(result.subtotal, 25);
  assert.equal(result.iva, 4);
  assert.equal(result.total, 29);
});
