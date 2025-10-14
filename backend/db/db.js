const {Pool} = require('pg');
const dotenv = require('dotenv');

dotenv.config();

function conexionDb() {
    const conexion = new Pool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: {
            rejectUnauthorized: false, // Render requiere SSL
        }
    });

    // Verificamos Conexion

    conexion.connect()
    .then(() => console.log('✅ Conectado a PostgreSQL correctamente'))
    .catch((err) => console.error('❌ Error de conexión a PostgreSQL:', err));

    return conexion;
}

module.exports = {conexionDb};