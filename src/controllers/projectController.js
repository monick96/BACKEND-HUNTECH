const projectService = require('../services/projectService');
// Express ya establece el Content-Type: application/json(lo que tenemos en constants.js) con res.json()
//CAPA CONTROLLER: recibe la peticion del router ,
//envia al servicio correspondiente y retorna respuesta(maneja los res y req)-- expone la funcionalidad

// funcion flecha asincronica por expresion
// funcion flecha asicronica por expresion
exports.createproject = async(req, res)=>{
    try {

        let project = req.body;
        
        //retorna id del projecto creado o error
        result = await projectService.createProject(project);

        res.status(201);
        res.json({ message: 'proyecto creado', projectId: result });
        
    } catch (error) {

        console.error('Error al crear proyecto: ' + error);

        res.status(500)

        res.json({ error: 'Error al crear proyectos: '+ error.message });
    }
}