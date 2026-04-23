const express = require('express');
const routerCareerDev = express.Router();
const careerDevController = require('../controllers/careerDevController');

/**
 * @swagger
 * /api/carreras_desarrollador:
 *   get:
 *     summary: Obtiene la lista de todas las relaciones entre desarrolladores y carreras
 *     tags:
 *       - Carreras Desarrollador
 *     responses:
 *       200:
 *         description: Lista de relaciones obtenida correctamente
 *       500:
 *         description: Error interno al procesar la solicitud
 */
routerCareerDev.get('/carreras_desarrollador', careerDevController.readCareerDevs);

/**
 * @swagger
 * /api/carrera_desarrollador:
 *   post:
 *     summary: Asocia una carrera a un desarrollador
 *     tags:
 *       - Carreras Desarrollador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email_desarrollador:
 *                 type: string
 *                 example: dev@huntech.com
 *               id_carrera:
 *                 type: integer
 *                 example: 1
 *               estado:
 *                 type: string
 *                 example: En curso
 *     responses:
 *       201:
 *         description: Asociación creada con éxito
 *       400:
 *         description: Faltan datos obligatorios para crear la relación
 *       500:
 *         description: Error interno del servidor
 */
routerCareerDev.post('/carrera_desarrollador', careerDevController.createCareerDev);

module.exports = routerCareerDev;
