const express = require('express');
const routerInstitucion = express.Router();
const institucionController = require('../controllers/institucionController')

routerInstitucion.get('/instituciones', institucionController.readInstituciones);
routerInstitucion.post('/institucion', institucionController.createInstitucion);

module.exports = routerInstitucion;