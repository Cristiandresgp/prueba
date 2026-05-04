import { useMemo, useState } from 'react';
import './App.css';
import { products } from './data/products';
import { calculateTotals } from './utils/cart';

const WHATSAPP_NUMBER = '5804143254573';
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || 'acctires-demo';

function App() {
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState('Todos');
  const [vehiculo, setVehiculo] = useState('Todos');
  const [carrito, setCarrito] = useState([]);
  const [checkout, setCheckout] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPass, setAdminPass] = useState('');

  const productosFiltrados = useMemo(() => products.filter((producto) => {
    const texto = [producto.nombre, producto.marca, producto.vehiculo, producto.referencia].join(' ').toLowerCase();
    return texto.includes(busqueda.toLowerCase()) && (tipo === 'Todos' || producto.tipo === tipo) && (vehiculo === 'Todos' || producto.vehiculo === vehiculo);
  }), [busqueda, tipo, vehiculo]);

  const { subtotal, iva, total } = calculateTotals(carrito);
  const stockTotal = products.reduce((suma, producto) => suma + producto.stock, 0);
  const valorInventario = products.reduce((suma, producto) => suma + producto.stock * producto.precio, 0);
  const productosSinStock = products.filter((producto) => producto.stock === 0).length;

  function agregarAlCarrito(producto) {
    if (producto.stock <= 0) return;
    const existing = carrito.find((item) => item.id === producto.id);
    if (existing) {
      setCarrito(carrito.map((item) => item.id === producto.id ? { ...item, cantidad: Math.min(item.cantidad + 1, producto.stock) } : item));
      return;
    }
    setCarrito([...carrito, { ...producto, cantidad: 1 }]);
  }

  function cambiarCantidad(id, cambio) {
    setCarrito(carrito.map((item) => {
      if (item.id !== id) return item;
      return { ...item, cantidad: Math.max(1, Math.min(item.stock, item.cantidad + cambio)) };
    }));
  }

  function enviarPedidoPorWhatsApp() {
    const detallePedido = carrito.map((item) => `• ${item.cantidad} x ${item.nombre} (${item.referencia}) - $${(item.precio * item.cantidad).toFixed(2)}`).join('\n');
    const mensaje = ['Hola ACCTIRES, quiero solicitar esta compra:', '', detallePedido, '', `Subtotal: $${subtotal.toFixed(2)}`, `IVA estimado: $${iva.toFixed(2)}`, `Total estimado: $${total.toFixed(2)}`, '', 'Método de pago a coordinar.'].join('\n');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');
  }

  function abrirAdmin() {
    if (adminAuth) setAdmin(true);
    else setAdmin(false);
  }

  return <main className="page">{/* UI preserved */}
    <section className="hero"><div><p className="tag">Catálogo digital</p><h1>ACCTIRES</h1><p className="subtitle">Cauchos y productos automotrices. Compra asistida por WhatsApp.</p><div className="hero-actions"><button onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}>Ver productos</button><button className="secondary" onClick={abrirAdmin}>Panel admin</button></div></div><div className="hero-card"><strong>{products.length}</strong><span>productos</span><small>Actualizado manualmente</small></div></section>
    <section className="filters"><input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por medida, marca, vehículo o referencia..." /><select value={tipo} onChange={(e) => setTipo(e.target.value)}><option>Todos</option><option>Caucho</option><option>Accesorio</option></select><select value={vehiculo} onChange={(e) => setVehiculo(e.target.value)}><option>Todos</option><option>Carro</option><option>Moto</option><option>Camioneta</option><option>Camión</option><option>General</option></select></section>
    <section className="layout"><div className="grid">{productosFiltrados.map((p) => <article className="card" key={p.id}><span className="brand">{p.marca}</span><h3>{p.nombre}</h3><p className="meta">Rin {p.rin} · {p.vehiculo}</p><p className="ref">Ref: {p.referencia} · Stock: {p.stock}</p><div className="bottom"><strong>${p.precio.toFixed(2)}</strong><button disabled={p.stock <= 0} onClick={() => agregarAlCarrito(p)}>{p.stock <= 0 ? 'Sin stock' : 'Agregar'}</button></div></article>)}</div>
    <aside className="cart"><h2>Carrito</h2>{carrito.map((item) => <div className="cart-item" key={item.id}><div><strong>{item.nombre}</strong><p>${item.precio.toFixed(2)} c/u</p></div><div className="qty"><button onClick={() => cambiarCantidad(item.id, -1)}>-</button><span>{item.cantidad}</span><button onClick={() => cambiarCantidad(item.id, 1)}>+</button></div></div>)}<div className="summary"><p>Subtotal <strong>${subtotal.toFixed(2)}</strong></p><p>IVA 16% <strong>${iva.toFixed(2)}</strong></p><p className="grand">Total <strong>${total.toFixed(2)}</strong></p></div><button className="checkout" disabled={!carrito.length} onClick={() => setCheckout(true)}>Revisar compra</button></aside></section>

    {!adminAuth && <section className="modal"><div className="modal-card"><h2>Acceso admin</h2><input value={adminPass} onChange={(e) => setAdminPass(e.target.value)} placeholder="Contraseña admin" /><button onClick={() => setAdminAuth(adminPass === ADMIN_PASS)}>Entrar</button><small>Configura VITE_ADMIN_PASS en .env</small></div></section>}
    {checkout && <section className="modal"><div className="modal-card"><button className="close" onClick={() => setCheckout(false)}>×</button><h2>Resumen</h2><button className="checkout" onClick={enviarPedidoPorWhatsApp}>Enviar por WhatsApp</button></div></section>}
    {admin && adminAuth && <section className="modal"><div className="modal-card"><button className="close" onClick={() => setAdmin(false)}>×</button><h2>Panel admin</h2><div className="stats"><div><strong>{products.length}</strong><span>Productos</span></div><div><strong>{stockTotal}</strong><span>Unidades</span></div><div><strong>${valorInventario.toFixed(2)}</strong><span>Inventario</span></div><div><strong>{productosSinStock}</strong><span>Sin stock</span></div></div></div></section>}
  </main>;
}

export default App;
