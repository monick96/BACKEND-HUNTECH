//const getPool = require("../dataBase/conexionSQL");
const pool = require("../dataBase/conexionPostgres");
//const crypto = require('crypto');

exports.getAllCareerDevsRepository = async () => {
    try {
        // const dbPool = await getPool();
        
        // const result = await dbPool.request().query(
        //     `SELECT * FROM dbo.carrera_x_desarrollador`
        // );

        // return result && result.recordset ? result.recordset : [];

        const result = await pool.query(
           `SELECT * FROM carrera_x_desarrollador`
        );

        return result.rows;

    } catch (error) {
        console.error('REPOSITORY - Error al obtener carreras por desarrollador: ' + error);
        throw Error('Error al obtener carreras por desarrollador: ' + error.message);
    }
};

exports.createCareerDevRepository = async (careerDev) => {
    try {
        /*const dbPool = await getPool();
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

        return `${careerDev.id_desarrollador}_${careerDev.id_carrera}`; */

        const query = `
            INSERT INTO carrera_x_desarrollador 
            (id_desarrollador, id_carrera, start_date, end_date, isvalidated)
            VALUES ($1, $2, $3, $4, $5);
        `;

        //valores en orden segun la query
        const values = [
            careerDev.id_desarrollador, 
            careerDev.id_carrera,
            careerDev.start_date || null,
            careerDev.end_date || null,
            careerDev.isvalidated//postres si tiene tipo de dato boolean
        ];
        
        const result = await pool.query(
            query,values
        );

       return `${careerDev.id_desarrollador}_${careerDev.id_carrera}`;; //retornar id de carrera_Desarrollador creada



    } catch (error) {
        console.error('REPOSITORY - Error al crear carrera por desarrollador: ' + error.message);
        throw Error('Error al crear carrera por desarrollador: ' + error.message);
    } finally {
        
        //dbPool.close(); // cerrar conexion al terminar la operacion

    } //no requiere finally

}