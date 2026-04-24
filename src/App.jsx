import { useMemo, useState } from 'react';
import './App.css';

const WHATSAPP_NUMBER = '5804143254573';

const productos = [
  {
    id: 1,
    nombre: '10.00R20 16PR TRIANGLE TR695 DIRECCIONAL',
    marca: 'TRIANGLE',
    tipo: 'Caucho',
    precio: 325,
    stock: 0,
    rin: '20',
    vehiculo: 'Camión',
    referencia: 'TRICAM2001',
  },
  {
    id: 2,
    nombre: '100/100-18 PIRELLI SCORPION MX EXTRA',
    marca: 'PIRELLI',
    tipo: 'Caucho',
    precio: 82.63,
    stock: 6,
    rin: '18',
    vehiculo: 'Moto',
    referencia: 'PIRMOT1801',
  },
  {
    id: 3,
    nombre: '100/80-14 PIRELLI DIABLO SCOOTER',
    marca: 'PIRELLI',
    tipo: 'Caucho',
    precio: 64.13,
    stock: 37,
    rin: '14',
    vehiculo: 'Moto',
    referencia: 'PIRMOT1401',
  },
  {
    id: 4,
    nombre: '100/80-16 PIRELLI DIABLO SCOOTER',
    marca: 'PIRELLI',
    tipo: 'Caucho',
    precio: 68.9,
    stock: 139,
    rin: '16',
    vehiculo: 'Moto',
    referencia: 'PIRMOT1601',
  },
  {
    id: 5,
    nombre: '195/65R15 GOODRIDE RP28',
    marca: 'GOODRIDE',
    tipo: 'Caucho',
    precio: 58,
    stock: 24,
    rin: '15',
    vehiculo: 'Carro',
    referencia: 'GOOCAR1501',
  },
  {
    id: 6,
    nombre: '205/55R16 FIRESTONE F700',
    marca: 'FIRESTONE',
    tipo: 'Caucho',
    precio: 72,
    stock: 16,
    rin: '16',
    vehiculo: 'Carro',
    referencia: 'FIRCAR1601',
  },
  {
    id: 7,
    nombre: '225/65R17 BRIDGESTONE DUELER',
    marca: 'BRIDGESTONE',
    tipo: 'Caucho',
    precio: 135,
    stock: 7,
    rin: '17',
    vehiculo: 'Camioneta',
    referencia: 'BRICAM1701',
  },
  {
    id: 8,
    nombre: 'Batería automotriz 700 AMP',
    marca: 'ACCTIRES',
    tipo: 'Accesorio',
    precio: 95,
    stock: 11,
    rin: '-',
    vehiculo: 'General',
    referencia: 'BAT700',
  },
  {
    id: 9,
    nombre: 'Aceite de motor 20W50 mineral',
    marca: 'ACCTIRES',
    tipo: 'Accesorio',
    precio: 18,
    stock: 30,
    rin: '-',
    vehiculo: 'General',
    referencia: 'ACE2050',
  },
];

function App() {
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState('Todos');
  const [vehiculo, setVehiculo] = useState('Todos');
  const [carrito, setCarrito] = useState([]);
  const [checkout, setCheckout] = useState(false);
  const [admin, setAdmin] = useState(false);

  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const textoProducto = [
        producto.nombre,
        producto.marca,
        producto.vehiculo,
        producto.referencia,
      ]
        .join(' ')
        .toLowerCase();

      const coincideBusqueda = textoProducto.includes(busqueda.toLowerCase());
      const coincideTipo = tipo === 'Todos' || producto.tipo === tipo;
      const coincideVehiculo = vehiculo === 'Todos' || producto.vehiculo === vehiculo;

      return coincideBusqueda && coincideTipo && coincideVehiculo;
    });
  }, [busqueda, tipo, vehiculo]);

  const subtotal = carrito.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0,
  );

  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  const stockTotal = productos.reduce((suma, producto) => suma + producto.stock, 0);

  const valorInventario = productos.reduce(
    (suma, producto) => suma + producto.stock * producto.precio,
    0,
  );

  const productosSinStock = productos.filter((producto) => producto.stock === 0).length;

  function agregarAlCarrito(producto) {
    const productoExistente = carrito.find((item) => item.id === producto.id);

    if (productoExistente) {
      setCarrito(
        carrito.map((item) => {
          if (item.id !== producto.id) return item;

          return {
            ...item,
            cantidad: item.cantidad + 1,
          };
        }),
      );
      return;
    }

    setCarrito([
      ...carrito,
      {
        ...producto,
        cantidad: 1,
      },
    ]);
  }

  function cambiarCantidad(id, cambio) {
    setCarrito(
      carrito.map((item) => {
        if (item.id !== id) return item;

        return {
          ...item,
          cantidad: Math.max(1, item.cantidad + cambio),
        };
      }),
    );
  }

  function eliminarDelCarrito(id) {
    setCarrito(carrito.filter((item) => item.id !== id));
  }

  function enviarPedidoPorWhatsApp() {
    const detallePedido = carrito
      .map((item) => {
        const totalProducto = item.precio * item.cantidad;
        return `• ${item.cantidad} x ${item.nombre} (${item.referencia}) - $${totalProducto.toFixed(2)}`;
      })
      .join('\n');

    const mensaje = [
      'Hola ACCTIRES, quiero solicitar esta compra:',
      '',
      detallePedido,
      '',
      `Subtotal: $${subtotal.toFixed(2)}`,
      `IVA estimado: $${iva.toFixed(2)}`,
      `Total estimado: $${total.toFixed(2)}`,
      '',
      'Método de pago a coordinar.',
    ].join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="tag">Catálogo digital demo</p>
          <h1>ACCTIRES</h1>
          <p className="subtitle">
            Cauchos, baterías y productos automotrices. Arma tu pedido y envíalo
            por WhatsApp.
          </p>

          <div className="hero-actions">
            <button>Ver productos</button>
            <button className="secondary" onClick={() => setAdmin(true)}>
              Panel admin
            </button>
          </div>
        </div>

        <div className="hero-card">
          <strong>{productos.length}</strong>
          <span>productos cargados</span>
          <small>Base de datos simulada</small>
        </div>
      </section>

      <section className="filters">
        <input
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Buscar por medida, marca, vehículo o referencia..."
        />

        <select value={tipo} onChange={(event) => setTipo(event.target.value)}>
          <option>Todos</option>
          <option>Caucho</option>
          <option>Accesorio</option>
        </select>

        <select
          value={vehiculo}
          onChange={(event) => setVehiculo(event.target.value)}
        >
          <option>Todos</option>
          <option>Carro</option>
          <option>Moto</option>
          <option>Camioneta</option>
          <option>Camión</option>
          <option>General</option>
        </select>
      </section>

      <section className="layout">
        <div className="grid">
          {productosFiltrados.map((producto) => (
            <article className="card no-image" key={producto.id}>
              <div className="card-body">
                <div className="line">
                  <span className="brand">{producto.marca}</span>
                  <span className={producto.stock > 0 ? 'available' : 'sold'}>
                    {producto.stock > 0 ? 'Disponible' : 'Consultar'}
                  </span>
                </div>

                <h3>{producto.nombre}</h3>
                <p className="meta">
                  Rin {producto.rin} · {producto.vehiculo}
                </p>
                <p className="ref">
                  Ref: {producto.referencia} · Stock: {producto.stock}
                </p>

                <div className="bottom">
                  <strong>${producto.precio.toFixed(2)}</strong>
                  <button onClick={() => agregarAlCarrito(producto)}>
                    Agregar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="cart">
          <div className="cart-head">
            <h2>Carrito</h2>
            <span>{carrito.length} productos</span>
          </div>

          {carrito.length === 0 && (
            <p className="empty">Agrega productos para generar una solicitud.</p>
          )}

          {carrito.map((item) => (
            <div className="cart-item" key={item.id}>
              <div>
                <strong>{item.nombre}</strong>
                <p>${item.precio.toFixed(2)} c/u</p>
              </div>

              <div className="qty">
                <button onClick={() => cambiarCantidad(item.id, -1)}>-</button>
                <span>{item.cantidad}</span>
                <button onClick={() => cambiarCantidad(item.id, 1)}>+</button>
              </div>

              <button className="remove" onClick={() => eliminarDelCarrito(item.id)}>
                ×
              </button>
            </div>
          ))}

          <div className="summary">
            <p>
              Subtotal <strong>${subtotal.toFixed(2)}</strong>
            </p>
            <p>
              IVA estimado 16% <strong>${iva.toFixed(2)}</strong>
            </p>
            <p className="grand">
              Total <strong>${total.toFixed(2)}</strong>
            </p>
          </div>

          <button
            className="checkout"
            disabled={carrito.length === 0}
            onClick={() => setCheckout(true)}
          >
            Revisar compra
          </button>
        </aside>
      </section>

      {checkout && (
        <section className="modal">
          <div className="modal-card">
            <button className="close" onClick={() => setCheckout(false)}>
              ×
            </button>

            <h2>Resumen de compra</h2>

            {carrito.map((item) => (
              <p key={item.id}>
                {item.cantidad} × {item.nombre} — $
                {(item.precio * item.cantidad).toFixed(2)}
              </p>
            ))}

            <div className="summary">
              <p>
                Subtotal <strong>${subtotal.toFixed(2)}</strong>
              </p>
              <p>
                IVA estimado <strong>${iva.toFixed(2)}</strong>
              </p>
              <p className="grand">
                Total <strong>${total.toFixed(2)}</strong>
              </p>
            </div>

            <h3>Métodos de pago</h3>
            <div className="payments">
              <span>Pago móvil</span>
              <span>Transferencia</span>
              <span>Zelle</span>
              <span>Efectivo</span>
            </div>

            <button className="checkout" onClick={enviarPedidoPorWhatsApp}>
              Enviar pedido por WhatsApp
            </button>
            <small>Demo: el pago se coordina luego por WhatsApp.</small>
          </div>
        </section>
      )}

      {admin && (
        <section className="modal">
          <div className="modal-card admin-panel">
            <button className="close" onClick={() => setAdmin(false)}>
              ×
            </button>

            <h2>Panel admin demo</h2>
            <p className="empty">Datos simulados de inventario y ventas.</p>

            <div className="stats">
              <div>
                <strong>{productos.length}</strong>
                <span>Productos</span>
              </div>
              <div>
                <strong>{stockTotal}</strong>
                <span>Unidades en stock</span>
              </div>
              <div>
                <strong>${valorInventario.toFixed(2)}</strong>
                <span>Valor inventario</span>
              </div>
              <div>
                <strong>{productosSinStock}</strong>
                <span>Sin stock</span>
              </div>
            </div>

            <h3>Base de datos simulada</h3>
            <div className="table">
              <div className="row head">
                <span>Ref</span>
                <span>Producto</span>
                <span>Stock</span>
                <span>Precio</span>
              </div>

              {productos.slice(0, 8).map((producto) => (
                <div className="row" key={producto.id}>
                  <span>{producto.referencia}</span>
                  <span>{producto.nombre}</span>
                  <span>{producto.stock}</span>
                  <span>${producto.precio.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
