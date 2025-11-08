const getPool = require("../dataBase/conexionSQL");
const crypto = require('crypto');


exports.getAllCareersRepository = async () => {
    try {

       
        let dbPool = await getPool();
        
        
        const result = await dbPool.request().query(
            `SELECT *
        FROM   carrera
        `
        );
        
        return result;

    } catch (error) {

        console.error('REPOSITORY - Error al obtener carreras: ' + error);

        throw Error('Error al obtener Carreras: ' + error.message);
    }
    
}

exports.createCareerRepository = async (Career) => {
    try {

        const dbPool = await getPool();

        const query = `
            INSERT INTO 
            dbo.carrera ( nombre, info_link, status, id_institucion_educativa)
            VALUES (
                @nombre, 
                @info_link, 
                @status, 
                @id_institucion_educativa
            ); 
            SELECT SCOPE_IDENTITY() AS id;
        `;

        const result = await dbPool.request()
            .input('nombre', Career.nombre)
            .input('info_link', Career.info_link || '')
            .input('status', Career.status || 'activo')
            .input('id_institucion_educativa', Career.id_institucion_educativa)
            .query(query);

        return result.recordset[0].id;

    } catch (error) {

        console.error('REPOSITORY - Error al crear carrera: ' + error.message);

        throw Error('Error al crear carrera: ' + error.message);
    }
    
}

