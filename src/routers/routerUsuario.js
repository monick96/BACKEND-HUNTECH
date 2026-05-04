const express = require('express');
const routerUsuario = express.Router();
const usuarioController = require('../controllers/usuarioController')

/*
################################## ########## ##################################
############################## USUARIOS GENÉRICOS ##############################
################################## ########## ##################################
*/

/* Retorna 1 si existe y la tabla donde lo encontro/ lo necesito para validar 
 si debo crear al usuario en la base de datos desde el front */
/**
 * @swagger
 * /api/usuario/{email}:
 *   get:
 *     summary: Verifica si existe un usuario y retorna en qué tabla está
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email del usuario a verificar
 *         schema:
 *           type: string
 *           example: pepito@gmail.com
 *     responses:
 *       200:
 *         description: El usuario ya existe en la DB
 *       404:
 *         description: El usuario no existe en la DB
 *       500:
 *         description: Error al buscar usuario por email
 */
routerUsuario.get('/usuario/:email', usuarioController.readUsuarioExistByEmail)

/* Ruta con tabla por parámetros para utilizar la data que se obtiene del método anterior */
/**
 * @swagger
 * /api/usuario/{email}/{tabla}:
 *   get:
 *     summary: Obtiene los datos completos de un usuario específico
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email del usuario
 *         schema:
 *           type: string
 *           example: pepito@gmail.com
 *       - in: path
 *         name: tabla
 *         required: true
 *         description: Tabla donde se encuentra el usuario (gerente, desarrollador, institucion_educativa)
 *         schema:
 *           type: string
 *           example: gerente
 *     responses:
 *       404:
 *         description: No hay ningún usuario en ' + tabla + ' con ese email
 *       200:
 *         description: Usuario obtenido correctamente o mensaje de que no existe
 *       500:
 *         description: Error al obtener usuario
 */
routerUsuario.get('/usuario/:email/:tabla', usuarioController.readUserByEmail)

routerUsuario.put('/usuario/:email', usuarioController.updateUsuarioByEmail)

/*
################################## ########## ##################################
################################### GERENTES ###################################
################################## ########## ##################################
*/


/**
 * @swagger
 * /api/gerentes:
 *   get:
 *     summary: Obtiene la lista de todos los gerentes
 *     tags:
 *       - Gerentes
 *     responses:
 *       200:
 *         description: gerentes obtenidos correctamente
 *       500:
 *         description: Error al obtener gerentes
 */
routerUsuario.get('/gerentes', usuarioController.readGerentes)
routerUsuario.post('/gerente', usuarioController.createGerente) 

/**
 * @swagger
 * /api/gerente:
 *   delete:
 *     summary: Elimina un gerente del sistema
 *     tags:
 *       - Gerentes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: gerente@huntech.com
 *     responses:
 *       200:
 *         description: gerente eliminado + email
 *       500:
 *         description: Error al intentar eliminar el gerente
 */
routerUsuario.delete('/gerente', usuarioController.deleteGerente)

/*
################################## ########## ##################################
############################### DESARROLLADORES ################################
################################## ########## ##################################
*/

/**
 * @swagger
 * /api/desarrolladores:
 *   get:
 *     summary: Obtiene la lista de todos los desarrolladores
 *     tags:
 *       - Desarrolladores
 *     responses:
 *       200:
 *         description: Desarrolladores obtenidos correctamente
 *       500:
 *         description: Error al obtener desarrolladores
 */
routerUsuario.get('/desarrolladores', usuarioController.readDesarrolladores)

routerUsuario.post('/desarrollador', usuarioController.createDesarrollador)

/**
 * @swagger
 * /api/desarrollador:
 *   delete:
 *     summary: Elimina un desarrollador del sistema
 *     tags:
 *       - Desarrolladores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: dev@huntech.com
 *     responses:
 *       200:
 *         description: desarrollador eliminado + email
 *       500:
 *         description: Error al intentar eliminar el desarrollador
 */
routerUsuario.delete('/desarrollador', usuarioController.deleteDesarrollador)//los delete no deberian usar body tampoco

/*
################################## ########## ##################################
############################# INSTITUCION EDUCATIVA ############################
################################## ########## ##################################
*/

/**
 * @swagger
 * /api/instituciones_educativas:
 *   get:
 *     summary: Obtiene la lista de todas las instituciones educativas
 *     tags:
 *       - Instituciones Educativas
 *     responses:
 *       200:
 *         description: Instituciones educativas obtenidas correctamente
 *       500:
 *         description: Error al obtener instituciones
 */
routerUsuario.get('/instituciones_educativas', usuarioController.readInstituciones)

/**
 * @swagger
 * /api/institucion_educativa:
 *   delete:
 *     summary: Elimina una institución educativa del sistema
 *     tags:
 *       - Instituciones Educativas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: instituto@huntech.com
 *     responses:
 *       200:
 *         description: Institución educativa eliminada + email
 *       500:
 *         description: Error al eliminar la institución
 */
routerUsuario.delete('/institucion_educativa', usuarioController.deleteInstitucion)

routerUsuario.post('/institucion_educativa', usuarioController.createInstitucion)



/*
################################## ########## ##################################
################################## DEPRECATED ##################################
################################## ########## ##################################
Cuidado. Esta parte del código está deprecada. 
No está siendo ni debería ser usada sin un motivo claro 
*/

// ruta para obtener gerente enviando body con email 
// Está mal conceptualmente un get no debe tener un body
// en su lugar usar routerUsuario.get('/usuario/:email/:tabla', usuarioController.readUserByEmail)
routerUsuario.get('/gerentebyemail', usuarioController.readGerenteByEmail)

// ruta para obtener IE enviando body con email 
// Está mal conceptualmente un get no debe tener un body
// en su lugar usar routerUsuario.get('/usuario/:email/:tabla', usuarioController.readUserByEmail)
routerUsuario.get('/institucion_educativabyemail', usuarioController.readInstitucionByEmail)

// ruta para obtener desarrollador enviando body con email 
// Está mal conceptualmente un get no debe tener un body
// en su lugar usar routerUsuario.get('/usuario/:email/:tabla', usuarioController.readUserByEmail)
routerUsuario.get('/desarrolladorbyemail', usuarioController.readDesarrolladorByEmail)

// Método para editar desarrollador
// Funciona, pero el que deberia usarse es routerUsuario.put('/usuario/:email', usuarioController.updateUsuarioByEmail)
routerUsuario.put('/desarrollador/:email', usuarioController.updateDesarrolladorByEmail)

// ruta para traer idiomas asociados a un desarrollador. 
// Deprecada, ahora esa función está cubierta por routerUsuario.get('/usuario/:email/:tabla', usuarioController.readUserByEmail)
routerUsuario.get('/desarrolladorLenguajes/:email', usuarioController.readDesarrolladorLanguages)






module.exports = routerUsuario;