//const getPool = require("../dataBase/conexionSQL");
const pool = require("../dataBase/conexionPostgres");
//const crypto = require('crypto');

exports.getAllCareersRepository = async () => {
    try {

        //dos metodos async
       /* let dbPool = await getPool();
        
        //las querys deberian ir en sqlQuery
        const result = await dbPool.request().query(
            `SELECT *
        FROM   carrera
        `
        );
        
        return result;*/
        //postgres

        const result = await pool.query(
            `SELECT * FROM   carrera`
        );

        return result.rows;

    } catch (error) {

        console.error('REPOSITORY - Error al obtener carreras: ' + error);

        throw Error('Error al obtener carrera: ' + error.message);
    }//no requiere finally
    
}

exports.createCareerRepository = async (career) => {
    try {

        /*dbPool = await getPool();

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
            
        return id;*/
        //postgres
        const query = `
            INSERT INTO 
            carrera (nombre, info_link, status, id_institucion_educativa)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `;//retorna id de la carrera creada

        //valores en orden segun la query
        const values = [
            career.nombre, 
            career.info_link,
            career.status,
            career.id_institucion_educativa
        ];
        
        const result = await pool.query(
            query,values
        );

        return result.rows[0].id; //retornar id de carrera creada


        
    } catch (error) {

        console.error('REPOSITORY - Error al crear carrera: ' + error.message);

        throw Error('Error al crear carrera: ' + error.message);
    
    }finally {
        
        //dbPool.close(); // cerrar conexion al terminar la operacion
        //no requiere finally

    } 

}