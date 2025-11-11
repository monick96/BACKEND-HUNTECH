const express = require('express');
const routerUsuario = express.Router();
const usuarioController = require('../controllers/usuarioController')

/* Retorna 1 si existe y la tabla donde lo encontro/ lo necesito para validar 
 si debo crear al usuario en la base de datos desde el front */
routerUsuario.get('/user/:email', usuarioController.readUsuarioExistByEmail)
/* Ruta con tabla por parámetros para utilizar la data que se obtiene del método anterior */
routerUsuario.get('/user/:email/:tabla', usuarioController.readUserByEmail)

/* ###Gerentes### */
routerUsuario.get('/gerentes', usuarioController.readGerentes)
routerUsuario.get('/gerentebyemail', usuarioController.readGerenteByEmail)
routerUsuario.post('/gerente', usuarioController.createGerente) 
routerUsuario.delete('/gerente', usuarioController.deleteGerente)

/* ###Desarrolladores### */
routerUsuario.get('/desarrolladores', usuarioController.readDesarrolladores)
routerUsuario.get('/desarrolladorbyemail', usuarioController.readDesarrolladorByEmail)
routerUsuario.post('/desarrollador', usuarioController.createDesarrollador)
routerUsuario.delete('/desarrollador', usuarioController.deleteDesarrollador)
routerUsuario.put('/desarrollador/:email', usuarioController.updateDesarrolladorByEmail)




module.exports = routerUsuario;