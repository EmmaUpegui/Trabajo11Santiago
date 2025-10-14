document.addEventListener('DOMContentLoaded', () => {
  const modalCrear = document.getElementById('modalCrearVenta');
  const btnNuevaVenta = document.getElementById('btnNuevaVenta');
  const cerrarCrear = document.getElementById('cerrarModalCrearVenta');

  const selectProducto = document.getElementById('id_producto');
  const cantidadInput = document.getElementById('cantidad');
  const selectUsuario = document.getElementById('usuario');

  const subtotalSpan = document.getElementById('subtotal');
  const ivaSpan = document.getElementById('iva');
  const totalSpan = document.getElementById('total');
  const mensajeError = document.getElementById('mensaje-error-venta');

  let productosData = [];

  // --- Cargar productos desde JSON ---
  async function cargarProductos() {
    try {
      const res = await fetch('/listarProductoJson');
      productosData = await res.json();

      selectProducto.innerHTML = '';
      productosData.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id_producto;
        option.dataset.precio = p.precio;
        option.dataset.cantidad = p.cantidad;
        option.textContent = `${p.nombre_producto} - $${p.precio} (Stock: ${p.cantidad})`;
        selectProducto.appendChild(option);
      });

      actualizarPrevisualizacion();
    } catch (error) {
      console.error('Error cargando productos:', error);
      selectProducto.innerHTML = '<option value="">Error al cargar productos</option>';
    }
  }

  // --- Cargar usuarios ---
  async function cargarUsuarios() {
    try {
      const res = await fetch('/listarUsuariosJson');
      const usuarios = await res.json();

      selectUsuario.innerHTML = '';
      usuarios.forEach(u => {
        const option = document.createElement('option');
        option.value = u.cedula;
        option.textContent = u.nombre_completo;
        selectUsuario.appendChild(option);
      });
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      selectUsuario.innerHTML = '<option value="">Error al cargar usuarios</option>';
    }
  }

  // --- Abrir modal ---
  if (btnNuevaVenta) {
    btnNuevaVenta.addEventListener('click', async () => {
      modalCrear.style.display = 'flex';
      cantidadInput.value = 1;
      mensajeError.style.display = 'none';
      await cargarProductos();
      await cargarUsuarios();
    });
  }

  // --- Cerrar modal ---
  if (cerrarCrear) cerrarCrear.addEventListener('click', () => modalCrear.style.display = 'none');
  window.addEventListener('click', e => { if (e.target === modalCrear) modalCrear.style.display = 'none'; });

  // --- Actualizar precios ---
  selectProducto.addEventListener('change', actualizarPrevisualizacion);
  cantidadInput.addEventListener('input', actualizarPrevisualizacion);

  function actualizarPrevisualizacion() {
    const cantidad = parseFloat(cantidadInput.value) || 0;
    const precio = parseFloat(selectProducto.selectedOptions[0]?.dataset.precio || 0);

    const subtotal = precio * cantidad;
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    subtotalSpan.textContent = subtotal.toFixed(2);
    ivaSpan.textContent = iva.toFixed(2);
    totalSpan.textContent = total.toFixed(2);
  }

  // --- Validar stock antes de enviar ---
  const formCrearVenta = document.getElementById('formCrearVenta');
  formCrearVenta.addEventListener('submit', (e) => {
    const productoSeleccionado = selectProducto.selectedOptions[0];
    const stockDisponible = parseInt(productoSeleccionado.dataset.cantidad);
    const cantidadSolicitada = parseInt(cantidadInput.value);

    if (cantidadSolicitada > stockDisponible) {
      e.preventDefault(); // evita enviar el form
      mensajeError.textContent = `❌ Stock insuficiente. Solo hay ${stockDisponible} unidades disponibles.`;
      mensajeError.style.display = 'block';
      return;
    }

    mensajeError.style.display = 'none';
  });

  actualizarPrevisualizacion();
});
