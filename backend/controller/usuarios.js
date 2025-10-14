const { conexionDb } = require('../db/db');

const db = conexionDb();

const usuario = {};

usuario.crear = async (req, res) => {
    try {
        // 1️⃣ Obtener datos enviados desde el formulario (req.body)
        const {
            cedula,
            nombre_completo,
            nombre_usuario,
            contrasena,
            id_rol
        } = req.body

        //SQL

        const query = `
            INSERT INTO usuarios values ($1, $2, $3, $4, $5) RETURNING *;
        `;

        const valores = [cedula,
            nombre_completo,
            nombre_usuario,
            contrasena,
            id_rol
        ];

        const resultado = await db.query(query, valores)

        console.log('✅ Usuario creado correctamente: ', resultado);
        res.redirect('/usuarios'); // redirige a la vista donde se mostrarán los usuarios

    } catch (error) {
        console.error('❌ Error al crear usuario:', error);
        res.redirect('/usuarios');
    }
}

usuario.listar = async (req, res) => {
  try {
    const query = `
      SELECT u.cedula, u.nombre_completo, u.nombre_usuario, r.nombre_rol
      FROM usuarios u
      LEFT JOIN roles r ON u.id_rol = r.id_rol
      ORDER BY u.cedula ASC
    `;
    const resultado = await db.query(query);

    res.render('usuario/usuarios', { usuarios: resultado.rows });

  } catch (error) {
    console.error('❌ Error al listar usuarios:', error);
    res.render('usuario/usuarios', { usuarios: [] });
  }
};


usuario.eliminar = async (req, res) => {
  try {
    const cedula = req.params.cedula; // 🔹 viene de la URL
    await db.query('DELETE FROM usuarios WHERE cedula = $1', [cedula]);

    console.log(`🗑️ usuario ${cedula} eliminado correctamente`);
    res.redirect('/usuarios');
  } catch (error) {
    console.error('❌ Error al eliminar rol:', error);
    res.redirect('/usuarios');
  }
};

// Mostrar el formulario con los datos del rol
usuario.formularioEditar = async (req, res) => {
  try {
    const cedula = req.params.cedula;
    const resultado = await db.query('SELECT * FROM usuarios WHERE cedula = $1', [cedula]);

    if (resultado.rows.length === 0) {
      return res.redirect('/usuarios');
    }

    res.render('/editarUsuario', { usuario: resultado.rows[0] });
  } catch (error) {
    console.error('❌ Error al obtener rol:', error);
    res.redirect('/usuarios');
  }
};

// Actualizar el rol
usuario.actualizar = async (req, res) => {
  try {
    const { cedula,
            nombre_completo,
            nombre_usuario,
            contrasena,
            id_rol } = req.body;

    await db.query(
      'UPDATE usuarios SET nombre_completo = $1, nombre_usuario = $2, contrasena = $3, id_rol = $4 WHERE cedula = $5',
      [nombre_completo,
            nombre_usuario,
            contrasena, id_rol, cedula]
    );

    console.log(`✏️ Usuario ${cedula} actualizado`);
    res.redirect('/usuarios');
  } catch (error) {
    console.error('❌ Error al actualizar rol:', error);
    res.redirect('/usuarios');
  }
};

usuario.login = async (req, res) => {
  try {
    const { nombre_usuario, contrasena } = req.body;

    // Buscar usuario en la base de datos
    const resultado = await db.query(
      'SELECT cedula, nombre_completo FROM usuarios WHERE nombre_usuario = $1 AND contrasena = $2',
      [nombre_usuario, contrasena]
    );

    if (resultado.rows.length === 0) {
      console.log('❌ Usuario no encontrado');
      return res.render('login', { error: 'Usuario o contraseña incorrectos' })
    }

    const usuarioDB = resultado.rows[0];

    // Guardar datos en la sesión
    req.session.usuario = usuarioDB.cedula;
    req.session.nombre_completo = usuarioDB.nombre_completo;

    console.log('✅ Usuario autenticado:', usuarioDB.nombre_completo);
    res.redirect('/ventas'); // redirige a la página principal

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.redirect('/');
  }
};

usuario.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('❌ Error al cerrar sesión:', err);
      return res.redirect('/');
    }
    res.clearCookie('connect.sid'); // borrar la cookie de sesión
    res.redirect('/');
  });
};



module.exports = usuario