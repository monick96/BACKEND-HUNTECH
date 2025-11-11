const express = require('express');
const routerUsuario = express.Router();
const usuarioController = require('../controllers/usuarioController')
//este me retorna 1 si exite y la tabla donde lo encontro/ lo necesecito para validar 
// si debo crear al usuario en la base de datos desde el front
routerUsuario.get('/user/:email', usuarioController.readUsuarioExistByEmail)
routerUsuario.get('/gerentes', usuarioController.readGerentes)
routerUsuario.get('/gerentebyemail', usuarioController.readGerenteByEmail)
routerUsuario.post('/gerente', usuarioController.createGerente) 
routerUsuario.delete('/gerente', usuarioController.deleteGerente)
routerUsuario.post('/desarrollador', usuarioController.createDesarrollador)
routerUsuario.put('/desarrollador/:email', usuarioController.updateDesarrolladorByEmail)
routerUsuario.get('/user/:email/:tabla', usuarioController.readUserByEmail)

module.exports = routerUsuario;