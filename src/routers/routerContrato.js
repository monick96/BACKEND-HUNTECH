const express = require('express');
const routerContrato= express.Router();
const contractController = require('../controllers/contractController');

routerContrato.get('/contratos',contractController.readContracts)


module.exports = routerContrato;