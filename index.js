const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

const { conexionDb } = require('./backend/db/db');
const routes = require('./backend/router');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9191;

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
const secret = process.env.SECRET || 'trabajo11';
app.use(session({
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 } // 1 hora
}));

// Middleware global para inyectar nombre_completo en todas las vistas
app.use((req, res, next) => {
  res.locals.nombre_completo = req.session?.nombre_completo || 'Invitado';
  next();
});

// Carpeta estática para CSS/JS
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// Configuración de vistas
app.set('views', path.join(__dirname, 'frontend', 'views'));
app.set('view engine', 'ejs');

// Rutas
app.use('/', routes);

// Conexión a la base de datos y levantado del servidor
const db = conexionDb();
(async () => {
  try {
    await db;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar:', error);
  }
})();
