document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ roles.js cargado correctamente");

  // --- MODALES ---
  const modalCrear = document.getElementById('modalCrearRol');
  const modalEditar = document.getElementById('modalEditarRol');

  // --- BOTONES ---
  const btnNuevo = document.getElementById('btnNuevoRol');
  const cerrarCrear = document.getElementById('cerrarModalCrear');
  const cerrarEditar = document.getElementById('cerrarModalEditar');

  // --- INPUTS DEL MODAL EDITAR ---
  const inputId = document.getElementById('editIdRol');
  const inputNombre = document.getElementById('editNombreRol');

  // --- ABRIR MODAL CREAR ---
  if (btnNuevo && modalCrear) {
    btnNuevo.addEventListener('click', () => {
      modalCrear.style.display = 'flex';
    });
  }

  // --- CERRAR MODAL CREAR ---
  if (cerrarCrear && modalCrear) {
    cerrarCrear.addEventListener('click', () => {
      modalCrear.style.display = 'none';
    });
  }

  // --- ABRIR MODAL EDITAR ---
  const botonesEditar = document.querySelectorAll('.btn-editar');
  if (botonesEditar.length && modalEditar) {
    botonesEditar.forEach(btn => {
      btn.addEventListener('click', () => {
        console.log("🟡 Editando:", btn.dataset);

        inputId.value = btn.dataset.id;
        inputNombre.value = btn.dataset.nombre;

        modalEditar.style.display = 'flex';
      });
    });
  }

  // --- CERRAR MODAL EDITAR ---
  if (cerrarEditar && modalEditar) {
    cerrarEditar.addEventListener('click', () => {
      modalEditar.style.display = 'none';
    });
  }

  // --- CERRAR AMBOS MODALES AL CLIC FUERA ---
  window.addEventListener('click', (e) => {
    if (e.target === modalCrear) modalCrear.style.display = 'none';
    if (e.target === modalEditar) modalEditar.style.display = 'none';
  });
});
