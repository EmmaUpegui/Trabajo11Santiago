document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ usuarios.js cargado correctamente");

  // --- MODALES ---
  const modalCrear = document.getElementById('modalCrearUsuario');
  const modalEditar = document.getElementById('modalEditarUsuario');

  // --- BOTONES ---
  const btnNuevo = document.getElementById('btnNuevoUsuario');
  const cerrarCrear = document.getElementById('cerrarModalCrearUsuario');
  const cerrarEditar = document.getElementById('cerrarModalEditarUsuario');

  // --- INPUTS MODAL CREAR ---
  const inputCedulaCrear = document.getElementById('cedula_usuario');
  const inputNombreCompletoCrear = document.getElementById('nombre_completo_usuario');
  const inputNombreUsuarioCrear = document.getElementById('nombre_usuario');
  const inputContrasenaCrear = document.getElementById('contrasena_usuario');
  const selectRolCrear = document.getElementById('rol_usuario');

  // --- INPUTS MODAL EDITAR ---
  const inputCedulaEditar = document.getElementById('editCedulaUsuario');
  const inputNombreCompletoEditar = document.getElementById('editNombreCompletoUsuario');
  const inputNombreUsuarioEditar = document.getElementById('editNombreUsuario');
  const inputContrasenaEditar = document.getElementById('editContrasenaUsuario');
  const selectRolEditar = document.getElementById('editRolUsuario');

  // --- FUNCIONES PARA CARGAR ROLES ---
  async function cargarRoles(selectElement, rolSeleccionado = '') {
    if (!selectElement) return;
    try {
      const response = await fetch('/listarRolesJson');
      const roles = await response.json();

      selectElement.innerHTML = '<option value="">Seleccione un rol</option>';
      roles.forEach(rol => {
        const option = document.createElement('option');
        option.value = rol.id_rol;
        option.textContent = rol.nombre_rol;
        if (rol.id_rol == rolSeleccionado) option.selected = true;
        selectElement.appendChild(option);
      });
    } catch (error) {
      console.error('Error cargando roles:', error);
      selectElement.innerHTML = '<option value="">Error cargando roles</option>';
    }
  }

  // --- ABRIR MODAL CREAR ---
  if (btnNuevo && modalCrear) {
    btnNuevo.addEventListener('click', async () => {
      modalCrear.style.display = 'flex';
      // Limpiar campos
      inputCedulaCrear.value = '';
      inputNombreCompletoCrear.value = '';
      inputNombreUsuarioCrear.value = '';
      inputContrasenaCrear.value = '';
      await cargarRoles(selectRolCrear);
    });
  }

  // --- CERRAR MODAL CREAR ---
  if (cerrarCrear && modalCrear) {
    cerrarCrear.addEventListener('click', () => {
      modalCrear.style.display = 'none';
    });
  }

  // --- BOTONES EDITAR ---
  const botonesEditar = document.querySelectorAll('.btn-editar');
  if (botonesEditar.length && modalEditar) {
    botonesEditar.forEach(btn => {
      btn.addEventListener('click', async () => {
        inputCedulaEditar.value = btn.dataset.cedula;
        inputNombreCompletoEditar.value = btn.dataset.nombreCompleto;
        inputNombreUsuarioEditar.value = btn.dataset.nombreUsuario;
        inputContrasenaEditar.value = btn.dataset.contrasena || '';

        await cargarRoles(selectRolEditar, btn.dataset.rolId);

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

  // --- CERRAR MODALES AL CLIC FUERA ---
  window.addEventListener('click', (e) => {
    if (e.target === modalCrear) modalCrear.style.display = 'none';
    if (e.target === modalEditar) modalEditar.style.display = 'none';
  });
});
