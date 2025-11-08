const getPool = require("../dataBase/conexionSQL");
const crypto = require('crypto');


exports.getAllInstitucionesRepository = async () => {
    try {

        //dos metodos async
        let dbPool = await getPool();
        
        //las querys deberian ir en sqlQuery
        const result = await dbPool.request().query(
            `SELECT *
        FROM   dbo.Institucion_Educativa
        `
        );
        
     return result && result.recordset ? result.recordset : [];

    } catch (error) {

        console.error('REPOSITORY - Error al obtener instituciones educativas: ' + error);

        throw Error('Error al obtener instituciones educativas: ' + error.message);
    }
    
}

exports.createInstitucionRepository = async (institucion) => {
    try {

        dbPool = await getPool();

        let id = crypto.randomUUID();

        const query = `
            INSERT INTO dbo.Institucion_Educativa (id,nombre, email)
             OUTPUT INSERTED.id
            VALUES ( @id,
                @nombre, 
                @email
            )
        `;

        await dbPool.request()
            .input('id', id)
            .input('nombre', institucion.nombre)
            .input('email', institucion.email)
            .query(query);
            
        return id;
        
    } catch (error) {

        console.error('REPOSITORY - Error al crear institucion educativa: ' + error.message);

        throw Error('Error al crear institucion educativa: ' + error.message);
    }
    
}