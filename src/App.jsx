import { useMemo, useState } from 'react';
import './App.css';

const productos = [
  { id: 1, nombre: '10.00R20 TRIANGLE TR695', marca: 'TRIANGLE', tipo: 'Caucho', precio: 325, stock: 0, rin: '20', vehiculo: 'Camión' },
  { id: 2, nombre: '100/100-18 PIRELLI SCORPION', marca: 'PIRELLI', tipo: 'Caucho', precio: 82.63, stock: 6, rin: '18', vehiculo: 'Moto' },
  { id: 3, nombre: '195/65R15 GOODRIDE RP28', marca: 'GOODRIDE', tipo: 'Caucho', precio: 58, stock: 12, rin: '15', vehiculo: 'Carro' },
  { id: 4, nombre: '205/55R16 FIRESTONE F700', marca: 'FIRESTONE', tipo: 'Caucho', precio: 72, stock: 8, rin: '16', vehiculo: 'Carro' },
  { id: 5, nombre: '225/65R17 BRIDGESTONE DUELER', marca: 'BRIDGESTONE', tipo: 'Caucho', precio: 135, stock: 4, rin: '17', vehiculo: 'Camioneta' },
  { id: 6, nombre: 'Aceite 20W50 Mineral', marca: 'ACCTIRES', tipo: 'Accesorio', precio: 18, stock: 20, rin: '-', vehiculo: 'General' }
];

function App() {
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState('Todos');
  const [carrito, setCarrito] = useState([]);

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const coincideTexto = `${p.nombre} ${p.marca} ${p.vehiculo}`.toLowerCase().includes(busqueda.toLowerCase());
      const coincideTipo = tipo === 'Todos' || p.tipo === tipo;
      return coincideTexto && coincideTipo;
    });
  }, [busqueda, tipo]);

  const total = carrito.reduce((suma, p) => suma + p.precio, 0);

  const agregar = (producto) => setCarrito([...carrito, producto]);
  const quitar = (index) => setCarrito(carrito.filter((_, i) => i !== index));

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="tag">Catálogo digital</p>
          <h1>ACCTIRES</h1>
          <p className="subtitle">Cauchos, accesorios y productos automotrices disponibles para cotización.</p>
        </div>
        <div className="hero-card">
          <strong>{productos.length}</strong>
          <span>productos cargados</span>
        </div>
      </section>

      <section className="filters">
        <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por caucho, marca o vehículo..." />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option>Todos</option>
          <option>Caucho</option>
          <option>Accesorio</option>
        </select>
      </section>

      <section className="layout">
        <div className="grid">
          {productosFiltrados.map((producto) => (
            <article className="card" key={producto.id}>
              <div className="image">🛞</div>
              <div className="brand">{producto.marca}</div>
              <h3>{producto.nombre}</h3>
              <p className="meta">Rin {producto.rin} · {producto.vehiculo}</p>
              <p className="stock">Stock: {producto.stock}</p>
              <div className="bottom">
                <strong>${producto.precio.toFixed(2)}</strong>
                <button onClick={() => agregar(producto)}>Agregar</button>
              </div>
            </article>
          ))}
        </div>

        <aside className="cart">
          <h2>Carrito</h2>
          {carrito.length === 0 ? <p className="empty">Todavía no hay productos.</p> : null}
          {carrito.map((item, index) => (
            <div className="cart-item" key={`${item.id}-${index}`}>
              <span>{item.nombre}</span>
              <button onClick={() => quitar(index)}>Quitar</button>
            </div>
          ))}
          <div className="total">Total estimado: <strong>${total.toFixed(2)}</strong></div>
          <button className="checkout" disabled={carrito.length === 0}>Solicitar compra</button>
          <small>La compra todavía es simulada. Luego se puede conectar con WhatsApp o base de datos.</small>
        </aside>
      </section>
    </main>
  );
}

export default App;
