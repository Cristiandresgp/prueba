export function calculateTotals(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;
  return { subtotal, iva, total };
}
