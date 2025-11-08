const careerDevRepository = require('../repositories/careerDevRepository');


exports.getAllCareerDevs = async () => {

    try {

        return await careerDevRepository.getAllCareerDevsRepository();

    } catch (error) {

        console.error('SERVICE - Error al obtener carreras por desarrollador: ' + error);

        throw Error('Error al obtener Carreras por Desarrollador: ' + error.message);
    }
    
}

exports.createCareerDev = async (careerDev) => {
    
     try {
        // Validaciones
        if (!careerDev.id_desarrollador || !careerDev.id_carrera) {
            throw new Error('Los campos "id_desarrollador" y "id_carrera" son obligatorios');
        }

        if (typeof careerDev.isvalidated !== 'boolean') {
            throw new Error('El campo "isvalidated" debe ser booleano (true o false)');
        }

        // Llamada al repository
        const result = await careerDevRepository.createCareerDevRepository(careerDev);
        
    } catch (error) {

        console.error('SERVICE - Error al crear carrera por desarrollador: ' + error);

        throw Error('Error al crear Carrera por Desarrollador: ' + error.message);
    }
    
}