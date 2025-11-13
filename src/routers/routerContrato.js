const express = require('express');
const routerContrato= express.Router();
const contractController = require('../controllers/contractController');

routerContrato.get('/contratos',contractController.readContracts)
routerContrato.get('/contratoslibres',contractController.readContracts)
routerContrato.get('/contratos_by_emailgerente', contractController.readContractsByGerenteEmail)
routerContrato.post('/contrato',contractController.createContract)
routerContrato.put("/contrato/:id/", contractController.updateContract)

module.exports = routerContrato;