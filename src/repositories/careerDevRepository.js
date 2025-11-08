const getPool = require("../dataBase/conexionSQL");
const crypto = require('crypto');

exports.getAllCareerDevsRepository = async () => {
    try {
        const dbPool = await getPool();
        
        const result = await dbPool.request().query(
            `SELECT * FROM dbo.carrera_x_desarrollador`
        );

        return result && result.recordset ? result.recordset : [];

    } catch (error) {
        console.error('REPOSITORY - Error al obtener carreras por desarrollador: ' + error);
        throw Error('Error al obtener carreras por desarrollador: ' + error.message);
    }
};

exports.createCareerDevRepository = async (careerDev) => {
    try {
        const dbPool = await getPool();
        const id = crypto.randomUUID();

        const query = `
            INSERT INTO dbo.carrera_x_desarrollador 
            (id_desarrollador, id_carrera, start_date, end_date, isvalidated)
            VALUES (@id_desarrollador, @id_carrera, @start_date, @end_date, @isvalidated)
        `;

        await dbPool.request()
            .input('id_desarrollador', careerDev.id_desarrollador)
            .input('id_carrera', careerDev.id_carrera)
            .input('start_date', careerDev.start_date || null)
            .input('end_date', careerDev.end_date || null)
            .input('isvalidated', careerDev.isvalidated ? 1 : 0)
            .query(query);

        return `${careerDev.id_desarrollador}_${careerDev.id_carrera}`; 

    } catch (error) {
        console.error('REPOSITORY - Error al crear carrera por desarrollador: ' + error.message);
        throw Error('Error al crear carrera por desarrollador: ' + error.message);
    }
};
