const express = require('express');
const routerProyecto= express.Router();
const projectController = require('../controllers/projectController')
//ROUTE PROYECT// ROUTER MANEJA ENRUTAMIENTO DE SOLICITUDES
//roUter que manejara las solicitudes sobre proyectos
//sin parentesis los metodos  por que 
// son callbacks- referenciamos a la funcion 
// la ejecucion se realizan en el controller 
// el objeto req y  res creado por express a partir de la solicitud http
//  e injectado en el metodo correspondiente

routerProyecto.post('/proyecto',projectController.createproject);

module.exports = routerProyecto; 