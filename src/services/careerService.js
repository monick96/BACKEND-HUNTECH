const CareerRepository = require('../repositories/careerRepository');

exports.getAllCareers = async () => {
    try {
        return await CareerRepository.getAllCareersRepository();
    } catch (error) {
        console.error('SERVICE - Error al obtener carreras: ' + error);
        throw Error('Error al obtener Carreras: ' + error.message);
    }
}


exports.createCareer = async (Career) => {
    try {

        if (!Career.nombre) {
            throw Error('Faltan campos obligatorios: nombre');
        }
        if (!Career.id_institucion_educativa) {
            throw Error('Faltan campos obligatorios: id_institucion_educativa');
        }


        return await CareerRepository.createCareerRepository(Career);
    } catch (error) {
        console.error('SERVICE - Error al crear carrera: ' + error);
        throw Error('Error al crear Carrera: ' + error.message);
    }
}
