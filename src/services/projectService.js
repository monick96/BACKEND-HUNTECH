const projectRepository = require('../repositories/projectRepository');

//CAPA SERVICE : logica de negocio
//usamos return para enviar resultado a controller y 
// throw error para propagar el error y que lo tome el controller

exports.createProject = async (project) => {
    
    try {
        
        if (!project.nombre || !project.description || !project.id_gerente || !project.email_gerente) {
            throw Error('Nombre, descripcion, id_gerente, email_gerente  son campos obligatorios' );
        }

        if (typeof project.buscando_devs !== 'boolean') {

            throw Error('El campo "buscando_devs" debe ser booleano');
        }

        return await projectRepository.createProyectRepository(project);
        
    } catch (error) {

        console.error('SERVICE - Error al crear proyecto: ' + error);

        throw Error(error.message);
    }
    
}

exports.getAllProjects = async () => {

    try {

        return await projectRepository.getAllProjectsRepository();
        
    } catch (error) {

        console.error('SERVICE - Error al obtener proyectos: ' + error);

        throw Error(error.message);
    }
    
}