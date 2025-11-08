const express = require('express');
const routerCareerDev = express.Router();
const careerDevController = require('../controllers/careerDevController');


routerCareerDev.get('/carreras_desarrollador', careerDevController.readCareerDevs);


routerCareerDev.post('/carrera_desarrollador', careerDevController.createCareerDev);

module.exports = routerCareerDev;
