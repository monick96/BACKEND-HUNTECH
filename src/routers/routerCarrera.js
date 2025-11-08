const express = require('express');
const routerCarrera = express.Router();
const careerController = require('../controllers/careerController')

routerCarrera.get('/Carreras', careerController.readCareers);
routerCarrera.post('/Carrera', careerController.createCareer);

module.exports = routerCarrera;