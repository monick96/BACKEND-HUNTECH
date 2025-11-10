const getPool = require("../dataBase/conexionSQL");
const crypto = require('crypto');


exports.getAllCareersRepository = async () => {
    try {

        //dos metodos async
        let dbPool = await getPool();
        
        //las querys deberian ir en sqlQuery
        const result = await dbPool.request().query(
            `SELECT *
        FROM   carrera
        `
        );
        
        return result;

    } catch (error) {

        console.error('REPOSITORY - Error al obtener carreras: ' + error);

        throw Error('Error al obtener carrera: ' + error.message);
    }
    
}

exports.createCareerRepository = async (career) => {
    try {

        dbPool = await getPool();

        let id = crypto.randomUUID();//id random con libreria incluida een node

        const query = `
            INSERT INTO 
            dbo.carrera (nombre, info_link, status, id_institucion_educativa)
            VALUES (
                @nombre, 
                @info_link, 
                @status, 
                @id_institucion_educativa
            )
        `;

        await dbPool.request()
            .input('nombre', career.nombre)
            .input('id_institucion_educativa', career.id_institucion_educativa)
            .input('info_link', career.info_link || '')
            .input('status', career.status || 1)

            .query(query);
            
        return id;
        
    } catch (error) {

        console.error('REPOSITORY - Error al crear carrera: ' + error.message);

        throw Error('Error al crear carrera: ' + error.message);
    
  }
   finally {
        
        dbPool.close(); // cerrar conexion al terminar la operacion

    } 

}