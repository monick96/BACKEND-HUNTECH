const express = require('express');
const routerUsuario = express.Router();
const usuarioController = require('../controllers/usuarioController')

routerUsuario.post('/existusuariobyemail', usuarioController.readUsuarioExistByEmail)
routerUsuario.get('/gerentes', usuarioController.readGerentes)
routerUsuario.get('/gerentebyemail', usuarioController.readGerenteByEmail)
routerUsuario.post('/gerente', usuarioController.createGerente) 
routerUsuario.delete('/gerente', usuarioController.deleteGerente)
routerUsuario.post('/desarrollador', usuarioController.createDesarrollador)
routerUsuario.put('/desarrollador/:email', usuarioController.updateDesarrolladorByEmail)
routerUsuario.get('/user/:email/:tabla', usuarioController.readUserByEmail)

module.exports = routerUsuario;