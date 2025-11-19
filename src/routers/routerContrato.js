const express = require('express');
const routerContrato= express.Router();
const contractController = require('../controllers/contractController');

routerContrato.get('/contratos',contractController.readContracts)
routerContrato.get('/contratoslibres',contractController.readContracts)
routerContrato.get('/contratos/:emailgerente', contractController.readContractsByGerenteEmail)
routerContrato.post('/contrato',contractController.createContract)
routerContrato.put("/contrato/:id/", contractController.updateContract)
routerContrato.put("/contrato/asignar/:id/", contractController.asignarCandidato)
routerContrato.delete('/contrato/:id',contractController.deleteContract)


module.exports = routerContrato;