const pool = require("../dataBase/conexionPostgres");

exports.getAllCareersRepository = async () => {
    try {

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
    
    }

}