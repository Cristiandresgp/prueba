import { useMemo, useState } from 'react';
import './App.css';

const productos = [
  { id: 1, nombre: '10.00R20 16PR TRIANGLE TR695 DIRECCIONAL', marca: 'TRIANGLE', tipo: 'Caucho', precio: 325, stock: 0, rin: '20', vehiculo: 'Camión', referencia: 'TRICAM2001' },
  { id: 2, nombre: '100/100-18 PIRELLI SCORPION MX EXTRA', marca: 'PIRELLI', tipo: 'Caucho', precio: 82.63, stock: 6, rin: '18', vehiculo: 'Moto', referencia: 'PIRMOT1801' },
  { id: 3, nombre: '100/80-14 PIRELLI DIABLO SCOOTER', marca: 'PIRELLI', tipo: 'Caucho', precio: 64.13, stock: 37, rin: '14', vehiculo: 'Moto', referencia: 'PIRMOT1401' },
  { id: 4, nombre: '100/80-16 PIRELLI DIABLO SCOOTER', marca: 'PIRELLI', tipo: 'Caucho', precio: 68.9, stock: 139, rin: '16', vehiculo: 'Moto', referencia: 'PIRMOT1601' },
  { id: 5, nombre: '100/80-17 PIRELLI SPORT DEMON', marca: 'PIRELLI', tipo: 'Caucho', precio: 61, stock: 0, rin: '17', vehiculo: 'Moto', referencia: 'PIRMOT1701' },
  { id: 6, nombre: '11R22.5 TRIANGLE TR668 REGIONAL', marca: 'TRIANGLE', tipo: 'Caucho', precio: 295, stock: 12, rin: '22.5', vehiculo: 'Camión', referencia: 'TRICAM2251' },
  { id: 7, nombre: '12R22.5 TRIANGLE TR685 MIXTA', marca: 'TRIANGLE', tipo: 'Caucho', precio: 348, stock: 8, rin: '22.5', vehiculo: 'Camión', referencia: 'TRICAM2252' },
  { id: 8, nombre: '195/65R15 GOODRIDE RP28', marca: 'GOODRIDE', tipo: 'Caucho', precio: 58, stock: 24, rin: '15', vehiculo: 'Carro', referencia: 'GOOCAR1501' },
  { id: 9, nombre: '205/55R16 FIRESTONE F700', marca: 'FIRESTONE', tipo: 'Caucho', precio: 72, stock: 16, rin: '16', vehiculo: 'Carro', referencia: 'FIRCAR1601' },
  { id: 10, nombre: '215/60R16 BRIDGESTONE TURANZA', marca: 'BRIDGESTONE', tipo: 'Caucho', precio: 105, stock: 10, rin: '16', vehiculo: 'Carro', referencia: 'BRICAR1602' },
  { id: 11, nombre: '225/65R17 BRIDGESTONE DUELER', marca: 'BRIDGESTONE', tipo: 'Caucho', precio: 135, stock: 7, rin: '17', vehiculo: 'Camioneta', referencia: 'BRICAM1701' },
  { id: 12, nombre: '245/70R16 TRIANGLE TR292 AT', marca: 'TRIANGLE', tipo: 'Caucho', precio: 128, stock: 14, rin: '16', vehiculo: 'Camioneta', referencia: 'TRICAM1601' },
  { id: 13, nombre: '265/65R17 TRIANGLE TR259 HT', marca: 'TRIANGLE', tipo: 'Caucho', precio: 152, stock: 5, rin: '17', vehiculo: 'Camioneta', referencia: 'TRICAM1702' },
  { id: 14, nombre: '185/70R14 PIRELLI FORMULA ENERGY', marca: 'PIRELLI', tipo: 'Caucho', precio: 55, stock: 18, rin: '14', vehiculo: 'Carro', referencia: 'PIRCAR1401' },
  { id: 15, nombre: '175/65R14 FIRESTONE F600', marca: 'FIRESTONE', tipo: 'Caucho', precio: 49, stock: 21, rin: '14', vehiculo: 'Carro', referencia: 'FIRCAR1401' },
  { id: 16, nombre: '235/75R15 GOODRIDE SL369', marca: 'GOODRIDE', tipo: 'Caucho', precio: 98, stock: 9, rin: '15', vehiculo: 'Camioneta', referencia: 'GOOCAM1501' },
  { id: 17, nombre: 'Batería automotriz 700 AMP', marca: 'ACCTIRES', tipo: 'Accesorio', precio: 95, stock: 11, rin: '-', vehiculo: 'General', referencia: 'BAT700' },
  { id: 18, nombre: 'Aceite de motor 20W50 mineral', marca: 'ACCTIRES', tipo: 'Accesorio', precio: 18, stock: 30, rin: '-', vehiculo: 'General', referencia: 'ACE2050' }
];

const WHATSAPP_NUMBER = '5804143254573';

function App() {
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState('Todos');
  const [vehiculo, setVehiculo] = useState('Todos');
  const [carrito, setCarrito] = useState([]);
  const [checkout, setCheckout] = useState(false);
  const [admin, setAdmin] = useState(false);

  const productosFiltrados = useMemo(() => productos.filter((p) => {
    const texto = `${p.nombre} ${p.marca} ${p.vehiculo} ${p.referencia}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase()) && (tipo === 'Todos' || p.tipo === tipo) && (vehiculo === 'Todos' || p.vehiculo === vehiculo);
  }), [busqueda, tipo, vehiculo]);

  const subtotal = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;
  const stockTotal = productos.reduce((suma, p) => suma + p.stock, 0);
  const valorInventario = productos.reduce((suma, p) => suma + p.stock * p.precio, 0);
  const sinStock = productos.filter((p) => p.stock === 0).length;

  const agregar = (producto) => {
    const existe = carrito.find((item) => item.id === producto.id);
    if (existe) setCarrito(carrito.map((item) => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item));
    else setCarrito([...carrito, { ...producto, cantidad: 1 }]);
  };

  const cambiarCantidad = (id, delta) => setCarrito(carrito.map((item) => item.id === id ? { ...item, cantidad: Math.max(1, item.cantidad + delta) } : item));
  const eliminar = (id) => setCarrito(carrito.filter((item) => item.id !== id));

  const enviarWhatsApp = () => {
    const detalle = carrito.map((item) => `• ${item.cantidad} x ${item.nombre} (${item.referencia}) - $${(item.precio * item.cantidad).toFixed(2)}`).join('\n');
    const mensaje = `Hola ACCTIRES, quiero solicitar esta compra:%0A%0A${encodeURIComponent(detalle)}%0A%0ASubtotal: $${subtotal.toFixed(2)}%0AIVA estimado: $${iva.toFixed(2)}%0ATotal estimado: $${total.toFixed(2)}%0A%0AMétodo de pago a coordinar.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, '_blank');
  };

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="tag">Catálogo digital demo</p>
          <h1>ACCTIRES</h1>
          <p className="subtitle">Cauchos, baterías y productos automotrices. Arma tu pedido y envíalo por WhatsApp.</p>
          <div className="hero-actions"><button>Ver productos</button><button className="secondary" onClick={() => setAdmin(true)}>Panel admin</button></div>
        </div>
        <div className="hero-card"><strong>{productos.length}</strong><span>productos cargados</span><small>Base de datos simulada</small></div>
      </section>

      <section className="filters">
        <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por medida, marca, vehículo o referencia..." />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}><option>Todos</option><option>Caucho</option><option>Accesorio</option></select>
        <select value={vehiculo} onChange={(e) => setVehiculo(e.target.value)}><option>Todos</option><option>Carro</option><option>Moto</option><option>Camioneta</option><option>Camión</option><option>General</option></select>
      </section>

      <section className="layout">
        <div className="grid">
          {productosFiltrados.map((producto) => (
            <article className="card no-image" key={producto.id}>
              <div className="card-body">
                <div className="line"><span className="brand">{producto.marca}</span><span className={producto.stock > 0 ? 'available' : 'sold'}>{producto.stock > 0 ? 'Disponible' : 'Consultar'}</span></div>
                <h3>{producto.nombre}</h3>
                <p className="meta">Rin {producto.rin} · {producto.vehiculo}</p>
                <p className="ref">Ref: {producto.referencia} · Stock: {producto.stock}</p>
                <div className="bottom"><strong>${producto.precio.toFixed(2)}</strong><button onClick={() => agregar(producto)}>Agregar</button></div>
              </div>
            </article>
          ))}
        </div>

        <aside className="cart">
          <div className="cart-head"><h2>Carrito</h2><span>{carrito.length} productos</span></div>
          {carrito.length === 0 && <p className="empty">Agrega productos para generar una solicitud de compra.</p>}
          {carrito.map((item) => (
            <div className="cart-item" key={item.id}>
              <div><strong>{item.nombre}</strong><p>${item.precio.toFixed(2)} c/u</p></div>
              <div className="qty"><button onClick={() => cambiarCantidad(item.id, -1)}>-</button><span>{item.cantidad}</span><button onClick={() => cambiarCantidad(item.id, 1)}>+</button></div>
              <button className="remove" onClick={() => eliminar(item.id)}>×</button>
            </div>
          ))}
          <div className="summary"><p>Subtotal <strong>${subtotal.toFixed(2)}</strong></p><p>IVA estimado 16% <strong>${iva.toFixed(2)}</strong></p><p className="grand">Total <strong>${total.toFixed(2)}</strong></p></div>
          <button className="checkout" disabled={carrito.length === 0} onClick={() => setCheckout(true)}>Revisar compra</button>
        </aside>
      </section>

      {checkout && <section className="modal"><div className="modal-card"><button className="close" onClick={() => setCheckout(false)}>×</button><h2>Resumen de compra</h2>{carrito.map((item) => <p key={item.id}>{item.cantidad} × {item.nombre} — ${(item.precio * item.cantidad).toFixed(2)}</p>)}<div className="summary"><p>Subtotal <strong>${subtotal.toFixed(2)}</strong></p><p>IVA estimado <strong>${iva.toFixed(2)}</strong></p><p className="grand">Total <strong>${total.toFixed(2)}</strong></p></div><h3>Métodos de pago</h3><div className="payments"><span>Pago móvil</span><span>Transferencia</span><span>Zelle</span><span>Efectivo</span></div><button className="checkout" onClick={enviarWhatsApp}>Enviar pedido por WhatsApp</button><small>Demo: el pago se coordina luego por WhatsApp.</small></div></section>}

      {admin && <section className="modal"><div className="modal-card admin-panel"><button className="close" onClick={() => setAdmin(false)}>×</button><h2>Panel admin demo</h2><p className="empty">Datos simulados de inventario y ventas.</p><div className="stats"><div><strong>{productos.length}</strong><span>Productos</span></div><div><strong>{stockTotal}</strong><span>Unidades en stock</span></div><div><strong>${valorInventario.toFixed(2)}</strong><span>Valor inventario</span></div><div><strong>{sinStock}</strong><span>Sin stock</span></div></div><h3>Base de datos simulada</h3><div className="table"><div className="row head"><span>Ref</span><span>Producto</span><span>Stock</span><span>Precio</span></div>{productos.slice(0, 8).map((p) => <div className="row" key={p.id}><span>{p.referencia}</span><span>{p.nombre}</span><span>{p.stock}</span><span>${p.precio.toFixed(2)}</span></div>)}</div></div></section>}
    </main>
  );
}

export default App;
