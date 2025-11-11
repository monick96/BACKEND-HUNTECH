const projectService = require("../services/projectService");
// Express ya establece el Content-Type: application/json con res.json()
//CAPA CONTROLLER: recibe la peticion del router ,
//envia al servicio correspondiente y retorna respuesta(maneja los res y req)-- expone la funcionalidad

// funcion flecha asincronica por expresion
exports.createproject = async (req, res) => {
  try {
    let project = req.body;

    const elGerenteYaTieneProyecto = await projectService.chequearSiExisteProyectoConEmail(project)

    if (elGerenteYaTieneProyecto == 1) {
      return res.status(400).json({ message: 'El gerente ya tiene un proyecto. Cada gerente puede poseer solo un proyecto' });
    }

    //retorna id del projecto creado o error
    result = await projectService.createProject(project);
    res.status(201);
    res.json({ message: "proyecto creado", projectId: result });
  } catch (error) {
    console.error("Error al crear proyecto: " + error);
    res.status(500);
    res.json({ error: "Error al crear proyectos: " + error.message });
  }
};

// funcion flecha asincronica por expresion
exports.readprojects = async (req, res) => {
  try {
    result = await projectService.getAllProjects();
    res.status(200);
    res.json({
      message: "proyectos obtenidos correctamente",
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error al obtener proyectos: " + error);
    res.status(500);
    res.json({ error: "Error al obtener proyectos: " + error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const projectUpdated = req.body;
    const emailGerente = req.params.emailGerente;
    const project = await projectService.updateProject(emailGerente, projectUpdated);
    //console.log(project)

    if (project == null) {
      return res
        .status(404)
        .send(`No se encuentra un proyecto a modificar con el emailGerente: ${emailGerente}`);
    }


    res.status(200)

    res.json({
      message: "proyectos actualizado",
      data: project,
    });

  } catch (error) {
    res.status(500).send({
      code: 500,
      message: "Error al actualizar el proyecto: " + /*projectUpdated*/ error.message,
    });
    throw Error("ERROR 500");
  }
};


exports.deleteProject = async (req, res) => {
  try {
    let { email } = req.params;
    result = await projectService.deleteProject(email)
    res.status(201);
    res.json({ message: 'proyecto eliminado', email: result });

  } catch (error) {
    console.error('Error al eliminar proyecto: ' + error);
    res.status(500)
    res.json({ error: 'Error al elimninar proyecto: ' + error.message });
  }
}

