const institucionRepository = require('../repositories/institucionRepository');

exports.getAllInstituciones = async () => {

    try {

        return await institucionRepository.getAllInstitucionesRepository();

    } catch (error) {

        console.error('SERVICE - Error al obtener institucion educativa: ' + error);

        throw Error('Error al obtener Institucion educativa: ' + error.message);
    }
    
}

exports.createInstitucion = async (institucion) => {
    
    try {
        
       if (!institucion.nombre || !institucion.email) {
        throw new Error('Los campos "nombre" y "email" son obligatorios');
    }

        return await institucionRepository.createInstitucionRepository(institucion);
        
    } catch (error) {

        console.error('SERVICE - Error al crear institucion: ' + error);

        throw Error('Error al crear Institucion: ' + error.message);
    }
    
}