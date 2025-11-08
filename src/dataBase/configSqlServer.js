require('dotenv').config();

// Configuración para el driver `mssql` (Microsoft SQL Server)
// Usamos DB_PORT para evitar colisionar con el puerto del servidor web
const config = {
    server: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT) || 1433,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // recomendado para conexiones remotas
        trustServerCertificate: true // acepta certificado autofirmado (útil en RDS)
    },
    // timeouts por defecto (en ms)
    connectionTimeout: 15000,
    requestTimeout: 15000
};

module.exports = config;
