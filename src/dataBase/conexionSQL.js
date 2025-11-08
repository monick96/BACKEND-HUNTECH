const sql = require('mssql');//driver nativo para SQL Server en Node.js
const config = require('./configSqlServer');

// ---- POOL conexion db ----
let poolDB; //lo hacemos singleton(patron de diseño -> una sola instancia)

async function getPool() {
    try {
        
        //connected es una propiedad del objeto ConnectionPool 
        // que viene del paquete mssql, es true o false
        if (poolDB && poolDB.connected) return poolDB;


        poolDB = await sql.connect(config);

        return poolDB;

    } catch (err) {
        console.error('Error al conectar con la base de datos:' + err.message);
        //pasamos el error 
        throw Error("Error al conectar con la base de datos:" + err.message);
        
    }
}

module.exports = getPool;