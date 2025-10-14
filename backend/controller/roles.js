const { conexionDb } = require('../db/db');

const db = conexionDb();

const roles = {};

roles.crear = async (req, res) => {
    try {
        // 1️⃣ Obtener datos enviados desde el formulario (req.body)
        const {
            nombre_rol
        } = req.body

        // 2️⃣ Validar campos obligatorios
        if(!nombre_rol) {
            console.log('⚠️ Faltan campos obligatorios');
            return res.redirect('/listaRoles');
        }

        //SQL
        const query = `
            INSERT INTO roles (nombre_rol) VALUES ($1) RETURNING *;
        `;

        const valores = [
            nombre_rol
        ];

        const resultado = await db.query(query, valores)

        console.log('✅ Rol creado correctamente: ', resultado);
        res.redirect('/listaRoles'); // redirige a la vista donde se mostrarán los usuarios

    } catch (error) {
        console.error('❌ Error al crear usuario:', error);
        res.redirect('/listaRoles');
    }
}

roles.listar = async (req, res) => {
    try {
    const resultado = await db.query('SELECT * FROM roles ORDER BY id_rol ASC');
    res.render('roles/listaRoles', { roles: resultado.rows });
  } catch (error) {
    console.error('❌ Error al listar roles:', error);
    res.render('roles/listaRoles');
  }
}

roles.eliminar = async (req, res) => {
  try {
    const id = req.params.id; // 🔹 viene de la URL
    await db.query('DELETE FROM roles WHERE id_rol = $1', [id]);

    console.log(`🗑️ Rol ${id} eliminado correctamente`);
    res.redirect('/listaRoles');
  } catch (error) {
    console.error('❌ Error al eliminar rol:', error);
    res.redirect('/listaRoles');
  }
};

// Mostrar el formulario con los datos del rol
roles.formularioEditar = async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await db.query('SELECT * FROM roles WHERE id_rol = $1', [id]);

    if (resultado.rows.length === 0) {
      return res.redirect('/listaRoles');
    }

    res.render('/editarRol', { rol: resultado.rows[0] });
  } catch (error) {
    console.error('❌ Error al obtener rol:', error);
    res.redirect('/listaRoles');
  }
};

// Actualizar el rol
roles.actualizar = async (req, res) => {
  try {
    const { id_rol, nombre_rol } = req.body;

    await db.query(
      'UPDATE roles SET nombre_rol = $1 WHERE id_rol = $2',
      [nombre_rol, id_rol]
    );

    console.log(`✏️ Rol ${id_rol} actualizado`);
    res.redirect('/listaRoles');
  } catch (error) {
    console.error('❌ Error al actualizar rol:', error);
    res.redirect('/listaRoles');
  }
};

roles.listarJson = async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM roles ORDER BY id_rol ASC');
    res.json(resultado.rows); // <-- esto es clave para fetch
  } catch (error) {
    console.error('❌ Error al listar roles (JSON):', error);
    res.status(500).json({ error: 'Error al listar roles' });
  }
};


module.exports = roles;