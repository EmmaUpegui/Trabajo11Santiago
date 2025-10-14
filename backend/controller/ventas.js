const { conexionDb } = require('../db/db');

const db = conexionDb();

const venta = {};

venta.obtenerPrecio = async (req, res) => {
  try {
    const { id_producto } = req.body;
    const resultado = await db.query('SELECT precio FROM productos WHERE id = $1', [id_producto]);

    if (resultado.rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    res.json({ precio: resultado.rows[0].precio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener precio' });
  }
}

venta.crearVenta = async (req, res) => {
  try {
    const { cantidad, id_producto, usuario } = req.body;
    const resultado = await db.query('SELECT precio, cantidad FROM productos WHERE id_producto = $1', [id_producto]);
    const precio = resultado.rows[0].precio;
    const cantidadProductos = resultado.rows[0].cantidad;

    // Validación de stock en backend (por seguridad)
    if (cantidad > cantidadProductos) {
      return res.status(400).send('Stock insuficiente');
    }

    const subtotal = precio * cantidad;
    const iva = subtotal * 0.12;
    const total = subtotal + iva;

    const queryInsert = `
      INSERT INTO ventas (cantidad, subtotal, iva, total, id_producto, usuario)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const valores = [cantidad, subtotal, iva, total, id_producto, usuario];
    await db.query(queryInsert, valores);

    const cantidadRestante = cantidadProductos - cantidad;
    await db.query('UPDATE productos SET cantidad = $1 WHERE id_producto = $2', [cantidadRestante, id_producto]);

    res.redirect('/ventas');
  } catch (error) {
    console.error(error);
    res.redirect('/ventas');
  }
};


venta.listar = async (req, res) => {
  try {
    const query = `
      SELECT v.id_venta,
             p.nombre_producto,
             u.nombre_completo AS nombre_usuario,
             v.cantidad,
             v.subtotal,
             v.iva,
             v.total
      FROM ventas v
      JOIN productos p ON v.id_producto = p.id_producto
      JOIN usuarios u ON v.usuario = u.cedula
      ORDER BY v.id_venta ASC;
    `;

    const resultadoVentas = await db.query(query);

    res.render('venta/ventas', { 
      ventas: resultadoVentas.rows,
      usuario: req.session.usuario // cédula del usuario logueado
    });

  } catch (error) {
    console.error('❌ Error al listar ventas:', error);
    res.render('venta/ventas', { ventas: [], usuario: '' });
  }
};


venta.eliminar = async (req, res) => {
  try {
    const id_venta = req.params.id_venta; // 🔹 viene de la URL
    await db.query('DELETE FROM ventas WHERE id_venta = $1', [id_venta]);

    console.log(`🗑️ venta ${id_venta} eliminado correctamente`);
    res.redirect('/ventas');
  } catch (error) {
    console.error('❌ Error al eliminar rol:', error);
    res.redirect('/ventas');
  }
};

venta.listarMisVentas = async (req, res) => {
  try {
    // Obtener la cédula o identificador del usuario desde la sesión
    const usuario = req.session.usuario; // ajusta esto según cómo guardes la sesión

    // Consulta para obtener las ventas de ese usuario
    const resultado = await db.query(
      'SELECT * FROM ventas WHERE usuario = $1 ORDER BY id_venta ASC',
      [usuario]
    );

    // Renderizar la vista pasando las ventas del usuario
    res.render('venta/ventas', { ventas: resultado.rows, usuario });
  } catch (error) {
    console.error('❌ Error al listar ventas:', error);
    res.render('venta/ventas', { ventas: [], usuario: null });
  }
}


module.exports = venta