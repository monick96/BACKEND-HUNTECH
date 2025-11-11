const projectRepository = require('../repositories/projectRepository');

//CAPA SERVICE : logica de negocio
//usamos return para enviar resultado a controller y 
// throw error para propagar el error y que lo tome el controller

exports.createProject = async (project) => {

    try {

        if (!project.nombre) {
            throw Error('Nombre es campo obligatorio');
        }

        if (!project.description) {
            throw Error('description es campo obligatorio');
        }

        if (!project.email_gerente) {
            throw Error('email_gerente es campo obligatorio');
        }

        if (project.buscando_devs && typeof project.buscando_devs !== 'boolean') {

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

exports.updateProject = async (emailGerente, projectUpdated) => {
    try {
        //console.log("SERVICE - UpdateProject")
        //console.log(`PUT Contract - Body: ${projectUpdated}, - URL Param: ${id}`)
        return await projectRepository.updateProjectRepository(emailGerente, projectUpdated)
    } catch (error) {
        console.log("Error en SERVICE - updateProject - " + error)
        throw Error("Error en SERVICE - updateProject - " + error)
    }
}

exports.deleteProject = async (email) => {
    try {
        if (!email) {
            throw Error("Se debe indicar el email del gerente cuyo proyecto se va a eliminar");
        }
        return await projectRepository.deleteProjectRepository(email)
    } catch (error) {
        console.error("SERVICE - Error al eliminar proyecto: " + error);
        throw Error("Error al eliminar proyecto: " + error.message);
    }
};