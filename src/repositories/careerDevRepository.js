const pool = require("../dataBase/conexionPostgres");

exports.getAllCareerDevsRepository = async () => {
    try {
    
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
            careerDev.isvalidated//postgres si tiene tipo de dato boolean
        ];
        
        await pool.query(query, values);

       return `${careerDev.id_desarrollador}_${careerDev.id_carrera}`; //retornar id de carrera_Desarrollador creada

    } catch (error) {
        console.error('REPOSITORY - Error al crear carrera por desarrollador: ' + error.message);
        throw Error('Error al crear carrera por desarrollador: ' + error.message);
    } 
}