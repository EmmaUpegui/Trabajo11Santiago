const { conexionDb } = require('../db/db');

const db = conexionDb();

const productos = {};

productos.crear = async (req, res) => {
    try {
        // 1️⃣ Obtener datos enviados desde el formulario (req.body)
        const {
            nombre_producto,
            precio,
            cantidad,
            categoria
        } = req.body

        //SQL

        const query = `
            INSERT INTO productos (nombre_producto,precio,cantidad,categoria) values ($1, $2, $3, $4) RETURNING *;
        `;

        const valores = [nombre_producto,
            precio,
            cantidad,
            categoria
        ];

        const resultado = await db.query(query, valores)

        console.log('✅ Usuario creado correctamente: ', resultado);
        res.redirect('/productos'); // redirige a la vista donde se mostrarán los usuarios

    } catch (error) {
        console.error('❌ Error al crear usuario:', error);
        res.redirect('/productos');
    }
}

productos.listar = async (req, res) => {
    try {
    const resultado = await db.query('SELECT * FROM productos ORDER BY id_producto ASC');
    res.render('producto/productos', { productos: resultado.rows });
  } catch (error) {
    console.error('❌ Error al listar productos:', error);
    res.render('prodcuto/productos');
  }
}

productos.eliminar = async (req, res) => {
  try {
    const id_producto = req.params.id_producto; // 🔹 viene de la URL
    await db.query('DELETE FROM productos WHERE id_producto = $1', [id_producto]);

    console.log(`🗑️ producto ${id_producto} eliminado correctamente`);
    res.redirect('/productos');
  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    res.redirect('/productos');
  }
};

// Mostrar el formulario con los datos del rol
productos.formularioEditar = async (req, res) => {
  try {
    const id_producto = req.params.id_producto;
    const resultado = await db.query('SELECT * FROM productos WHERE id_producto = $1', [id_producto]);

    if (resultado.rows.length === 0) {
      return res.redirect('/productos');
    }

    res.render('/editarProducto', { producto: resultado.rows[0] });
  } catch (error) {
    console.error('❌ Error al obtener el producto:', error);
    res.redirect('/productos');
  }
};

// Actualizar el rol
productos.actualizar = async (req, res) => {
  try {
    const { id_producto,nombre_producto,
            precio,
            cantidad,
            categoria } = req.body;

    await db.query(
      'UPDATE productos SET nombre_producto = $1, precio = $2, cantidad = $3, categoria = $4 WHERE id_producto = $5',
      [nombre_producto,
            precio,
            cantidad,
            categoria,id_producto ]
    );

    console.log(`✏️ Producto ${id_producto} actualizado`);
    res.redirect('/productos');
  } catch (error) {
    console.error('❌ Error al actualizar producto:', error);
    res.redirect('/productos');
  }
};

productos.listarJson = async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM productos ORDER BY id_producto ASC');
    res.json(resultado.rows); // <-- esto es clave para fetch
  } catch (error) {
    console.error('❌ Error al listar productos (JSON):', error);
    res.status(500).json({ error: 'Error al listar roles' });
  }
};


module.exports = productos