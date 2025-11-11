
const getPool = require("../dataBase/conexionSQL");
const sql = require('mssql');

exports.getAllContractsRepository = async () => {
    let dbPool = await getPool();
    try {
      const result = await dbPool.request().query(`
              SELECT
                  *
              FROM
                  contrato
              `);
              
      return result.recordset;
    } catch (error) {
      console.error("REPOSITORY - Error al obtener contratos: " + error);
      throw Error("Error al obtener Contratos: " + error.message);
    } finally {
      dbPool.close();
    }
  };

  exports.getAllNotOcuppiedContractsRepository = async () => {
    try {
      let dbPool = await getPool();
      const result = await dbPool.request().query(`
              SELECT
                  *
              FROM
                  contrato
                  where esta_ocupado = false
              `);
      return result;
    } catch (error) {
      console.error("REPOSITORY - Error al obtener contratos: " + error);
      throw Error("Error al obtener Contratos: " + error.message);
    } finally {
      dbPool.close();
    }
  };