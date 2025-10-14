document.addEventListener('DOMContentLoaded', () => {
  const modalCrear = document.getElementById('modalCrearProducto');
  const modalEditar = document.getElementById('modalEditarProducto');

  const btnNuevo = document.getElementById('btnNuevoProducto');
  const cerrarCrear = document.getElementById('cerrarModalCrearProducto');
  const cerrarEditar = document.getElementById('cerrarModalEditarProducto');

  // Crear inputs
  const inputNombreCrear = document.getElementById('nombre_producto');
  const inputPrecioCrear = document.getElementById('precio_producto');
  const inputCantidadCrear = document.getElementById('cantidad_producto');
  const inputCategoriaCrear = document.getElementById('categoria_producto');

  // Editar inputs
  const inputIdEditar = document.getElementById('editIdProducto');
  const inputNombreEditar = document.getElementById('editNombreProducto');
  const inputPrecioEditar = document.getElementById('editPrecioProducto');
  const inputCantidadEditar = document.getElementById('editCantidadProducto');
  const inputCategoriaEditar = document.getElementById('editCategoriaProducto');

  // Abrir modal crear
  if (btnNuevo) {
    btnNuevo.addEventListener('click', () => {
      modalCrear.style.display = 'flex';
      inputNombreCrear.value = '';
      inputPrecioCrear.value = '';
      inputCantidadCrear.value = '';
      inputCategoriaCrear.value = '';
    });
  }

  if (cerrarCrear) cerrarCrear.addEventListener('click', () => modalCrear.style.display = 'none');

  // Abrir modal editar
  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', () => {
      inputIdEditar.value = btn.dataset.id;
      inputNombreEditar.value = btn.dataset.nombre;
      inputPrecioEditar.value = btn.dataset.precio;
      inputCantidadEditar.value = btn.dataset.cantidad;
      inputCategoriaEditar.value = btn.dataset.categoria;
      modalEditar.style.display = 'flex';
    });
  });

  if (cerrarEditar) cerrarEditar.addEventListener('click', () => modalEditar.style.display = 'none');

  // Cerrar modales al hacer clic fuera
  window.addEventListener('click', e => {
    if (e.target === modalCrear) modalCrear.style.display = 'none';
    if (e.target === modalEditar) modalEditar.style.display = 'none';
  });
});
