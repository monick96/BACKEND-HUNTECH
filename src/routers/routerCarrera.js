const express = require('express');
const routerCarrera = express.Router();
const careerController = require('../controllers/careerController')

/**
 * @swagger
 * /api/carreras:
 *   get:
 *     summary: Obtiene la lista de todas las carreras
 *     tags:
 *       - Carreras
 *     responses:
 *       200:
 *         description: Lista de carreras obtenida correctamente
 *       500:
 *         description: Error interno al obtener las carreras
 */
routerCarrera.get('/carreras', careerController.readCareers);

/**
 * @swagger
 * /api/carreras:
 *   post:
 *     summary: Crea una nueva carrera
 *     tags:
 *       - Carreras
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Desarrollo de Software
 *               id_institucion:
 *                 type: string
 *                 example: IFTS 11
 *     responses:
 *       201:
 *         description: Carrera creada con éxito
 *       400:
 *         description: Faltan datos obligatorios para crear la carrera
 *       500:
 *         description: Error interno al procesar la solicitud
 */
routerCarrera.post('/carrera', careerController.createCareer);

module.exports = routerCarrera;