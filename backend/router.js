const express = require('express');
const router = express.Router();

// Controladores
const roles = require('./controller/roles');
const usuarios = require('./controller/usuarios');
const productos = require('./controller/productos');
const ventas = require('./controller/ventas');
const venta = require('./controller/ventas');

// Middleware para verificar sesión
function asegurarseAutenticado(req, res, next) {
  if (req.session && req.session.usuario) {
    return next();
  } else {
    res.redirect('/'); // Redirige al login si no hay sesión activa
  }
}

// Middleware global para pasar el usuario a todas las vistas EJS
router.use((req, res, next) => {
  res.locals.usuario = req.session ? req.session.usuario : null;
  next();
});

// =========================
// LOGIN / LOGOUT
// =========================

// Página de login (sin header ni sidebar)
router.get('/', (req, res) => {
  res.render('login');
});

// Procesar login
router.post('/login', usuarios.login);

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error('Error al cerrar sesión:', err);
    res.redirect('/');
  });
});

// =========================
// HOME
// =========================
router.get('/inicio', asegurarseAutenticado, (req, res) => {
  res.render('home', { usuario: req.session.usuario });
});

// =========================
// ROLES
// =========================
router.get('/listarRolesJson', asegurarseAutenticado, roles.listarJson);
router.get('/listaRoles', asegurarseAutenticado, roles.listar);
router.get('/crearRoles', asegurarseAutenticado, (req, res) => res.render('roles/crearRol'));
router.post('/crearRoles', asegurarseAutenticado, roles.crear);
router.get('/eliminarRol/:id', asegurarseAutenticado, roles.eliminar);
router.get('/editarRol/:id', asegurarseAutenticado, roles.formularioEditar);
router.post('/actualizarRol', asegurarseAutenticado, roles.actualizar);

// =========================
// USUARIOS
// =========================
router.get('/usuarios', asegurarseAutenticado, usuarios.listar);
router.get('/crearUsuario', asegurarseAutenticado, (req, res) => res.render('usuario/crearUsuario'));
router.post('/crearUsuario', asegurarseAutenticado, usuarios.crear);
router.get('/eliminarUsuario/:cedula', asegurarseAutenticado, usuarios.eliminar);
router.get('/editarUsuario/:id', asegurarseAutenticado, usuarios.formularioEditar);
router.post('/actualizarUsuario', asegurarseAutenticado, usuarios.actualizar);

// =========================
// PRODUCTOS
// =========================
router.get('/listarProductoJson', asegurarseAutenticado, productos.listarJson);
router.get('/productos', asegurarseAutenticado, productos.listar);
router.get('/crearProducto', asegurarseAutenticado, (req, res) => res.render('producto/crearProducto'));
router.post('/crearProducto', asegurarseAutenticado, productos.crear);
router.get('/eliminarProducto/:id_producto', asegurarseAutenticado, productos.eliminar);
router.get('/editarProducto/:id_producto', asegurarseAutenticado, productos.formularioEditar);
router.post('/actualizarProducto', asegurarseAutenticado, productos.actualizar);

// =========================
// VENTAS
// =========================
router.get('/ventas', asegurarseAutenticado, ventas.listar);
router.get('/crearVenta', asegurarseAutenticado, (req, res) => res.render('venta/crearVenta'));
router.post('/obtenerPrecio', asegurarseAutenticado, venta.obtenerPrecio);
router.post('/crearVenta', asegurarseAutenticado, venta.crearVenta);
router.get('/ventas/:id_venta', asegurarseAutenticado,venta.generarPDF);
router.get('/eliminarVenta/:id_venta', asegurarseAutenticado, venta.eliminar);

module.exports = router;
