const express = require('express');
const routerProyecto= express.Router();
const projectController = require('../controllers/projectController')
//ROUTE PROYECT// ROUTER MANEJA ENRUTAMIENTO DE SOLICITUDES
//roUter que manejara las solicitudes sobre proyectos
//sin parentesis los metodos  por que 
// son callbacks- referenciamos a la funcion 
// la ejecucion se realizan en el controller 
// el objeto req y  res creado por express a partir de la solicitud http
//  e injectado en el metodo correspondiente
/**
 * @swagger
 * /api/proyectos:
 *   get:
 *     summary: Lista todos los proyectos
 *     tags:
 *       - Proyectos
 *     responses:
 *       200:
 *         description: Proyectos obtenidos correctamente
 */
routerProyecto.get('/proyectos',projectController.readprojects);

/**
 * @swagger
 * /api/proyecto/{email_gerente}:
 *   get:
 *     summary: Obtiene un proyecto por el email del gerente
 *     tags:
 *       - Proyectos
 *     parameters:
 *       - in: path
 *         name: email_gerente
 *         required: true
 *         description: Email del gerente para buscar su proyecto asociado
 *         schema:
 *           type: string
 *           example: pepito@gmail.com
 *     responses:
 *       200:
 *         description: Proyecto hallado o No hay ningún proyecto con ese email
 *       500:
 *         description: Error al obtener el proyecto
 */
routerProyecto.get('/proyecto/:email_gerente',projectController.readProyectoByEmail)

/**
 * @swagger
 * /api/proyecto:
 *   post:
 *     summary: Crea un nuevo proyecto (solo si sos gerente y no tenes un proyecto activo)
 *     tags:
 *       - Proyectos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Matecito 2.0"
 *               description:
 *                 type: string
 *                 example: "Aplicación web y móvil para venta de mates y accesorios."
 *               info_link:
 *                 type: string
 *                 example: "https://www.matecito.com"
 *               buscando_devs:
 *                 type: boolean
 *                 example: true
 *               id_gerente:
 *                 type: string
 *                 example: "5"
 *               email_gerente:
 *                 type: string
 *                 example: "pepito@gmail.com"
 *     responses:
 *       201:
 *         description: Proyecto creado
 *       400:
 *         description: El gerente ya tiene un proyecto
 */
routerProyecto.post('/proyecto',projectController.createproject);

/**
 * @swagger
 * /api/proyecto/{emailGerente}:
 *   put:
 *     summary: Actualiza la información de un proyecto existente por el email del gerente (solo si sos el gerente dueño del proyecto)
 *     tags:
 *       - Proyectos
 *     parameters:
 *       - in: path
 *         name: emailGerente
 *         required: true
 *         description: Email del gerente dueño del proyecto a actualizar
 *         schema:
 *           type: string
 *           example: pepito@gmail.com
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Matecito 2.1
 *               description:
 *                 type: string
 *                 example: Nueva descripción del proyecto
 *               info_link:
 *                 type: string
 *                 example: https://www.matecito-nuevo.com
 *               buscando_devs:
 *                 type: boolean
 *                 example: false
 *               contratos:
 *                 type: string
 *                 example: Información adicional de contratos
 *               id_gerente:
 *                 type: string
 *                 example: "5"
 *     responses:
 *       200:
 *         description: Proyecto actualizado con éxito
 *       404:
 *         description: No se encuentra un proyecto a modificar con el emailGerenteproporcionado
 *       500:
 *         description: Error al actualizar el proyecto + eror de servidor
 */
routerProyecto.put('/proyecto/:emailGerente',projectController.updateProject)

/**
 * @swagger
 * /api/proyecto/{email}:
 *   delete:
 *     summary: Elimina un proyecto por el email del gerente
 *     tags:
 *       - Proyectos
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email del gerente cuyo proyecto se va a eliminar
 *         schema:
 *           type: string
 *           example: pepito@gmail.com
 *     responses:
 *       200:
 *         description: Proyecto eliminado
 *       500:
 *         description: Error interno al intentar eliminar el proyecto
 */
routerProyecto.delete('/proyecto/:email',projectController.deleteProject)


module.exports = routerProyecto;