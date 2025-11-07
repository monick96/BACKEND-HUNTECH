require('dotenv').config();

const config = {
    server: process.env.DB_SERVER,
    port: Number(process.env.PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
   // options: { encrypt: true, trustServerCertificate: true }//para que no pida certificado ssl
};

module.exports = config;
