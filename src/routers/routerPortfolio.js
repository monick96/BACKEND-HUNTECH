const express = require('express');
const routerPortfolio = express.Router();
const portfolioController = require('../controllers/portfolioController');
/* import { requireAuth } from '../middleware/authMiddleware.js' */

// Ruta para obtener el portfolio asociado a un desarrollador
/**
 * @swagger
 * /api/portfolio/{email}:
 *   get:
 *     summary: Obtiene el portfolio asociado a un desarrollador
 *     tags:
 *       - Portfolio
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email del desarrollador
 *         schema:
 *           type: string
 *           example: desarrollador@ejemplo.com
 *     responses:
 *       200:
 *         description: Portfolio obtenido correctamente
 *       500:
 *         description: Error al obtener portfolio
 */
routerPortfolio.get('/portfolio/:email', portfolioController.getPortfolioById)

// Ruta para crear portfolio
/**
 * @swagger
 * /api/createportfolio/{email}:
 *   post:
 *     summary: Crea un nuevo portfolio para un desarrollador
 *     tags:
 *       - Portfolio
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email del desarrollador
 *         schema:
 *           type: string
 *           example: desarrollador@ejemplo.com
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo1:
 *                 type: string
 *                 example: "Proyecto E-commerce"
 *               titulo2:
 *                 type: string
 *                 example: "App móvil"
 *               titulo3:
 *                 type: string
 *                 example: "Landing page"
 *               descripcion1:
 *                 type: string
 *                 example: "Plataforma de ventas con React y Node"
 *               descripcion2:
 *                 type: string
 *                 example: "Aplicación de fitness con Flutter"
 *               descripcion3:
 *                 type: string
 *                 example: "Sitio promocional responsive"
 *               imagenes1:
 *                 type: array
 *                 items:
 *                   type: string
 *                 maxItems: 3
 *                 example: ["url1.jpg", "url2.jpg"]
 *               imagenes2:
 *                 type: array
 *                 items:
 *                   type: string
 *                 maxItems: 3
 *               imagenes3:
 *                 type: array
 *                 items:
 *                   type: string
 *                 maxItems: 3
 *               repositorio1:
 *                 type: string
 *                 example: "https://github.com/usuario/proyecto1"
 *               repositorio2:
 *                 type: string
 *               repositorio3:
 *                 type: string
 *     responses:
 *       201:
 *         description: Portfolio creado exitosamente
 *       400:
 *         description: Ya existe un portfolio para ese usuario o límite de imágenes excedido
 *       500:
 *         description: Error al crear portfolio
 */
routerPortfolio.post('/createportfolio/:email', portfolioController.createPortfolio);

// Ruta para eliminar portfolio
/**
 * @swagger
 * /api/deleteportfolio/{email}:
 *   delete:
 *     summary: Elimina el portfolio de un desarrollador
 *     tags:
 *       - Portfolio
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email del desarrollador
 *         schema:
 *           type: string
 *           example: desarrollador@ejemplo.com
 *     responses:
 *       200:
 *         description: Portfolio eliminado correctamente
 *       500:
 *         description: Error al eliminar portfolio
 */
routerPortfolio.delete('/deleteportfolio/:email', portfolioController.deletePortfolio)

// Ruta para editar portfolio
/**
 * @swagger
 * /api/updateportfolio/{email}:
 *   put:
 *     summary: Actualiza total o parcialmente el portfolio de un desarrollador
 *     description: |
 *       Todos los campos del body son opcionales. Los arrays `imagenes1`, `imagenes2`, `imagenes3` 
 *       deben contener URLs de imágenes (máximo 3 por proyecto). Si se envía un array, reemplazará 
 *       al existente. Para eliminar una imagen, se debe enviar el array sin esa URL.
 *     tags:
 *       - Portfolio
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email del desarrollador
 *         schema:
 *           type: string
 *           example: juan.perez@example.com
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo1:
 *                 type: string
 *                 description: Título del primer proyecto
 *                 example: "Marketplace de mascotas"
 *               titulo2:
 *                 type: string
 *                 example: "Dashboard IoT"
 *               titulo3:
 *                 type: string
 *                 example: "Blog técnico"
 *               descripcion1:
 *                 type: string
 *                 example: "Plataforma completa con pasarela de pagos"
 *               descripcion2:
 *                 type: string
 *               descripcion3:
 *                 type: string
 *               imagenes1:
 *                 type: array
 *                 description: URLs de hasta 3 imágenes para el primer proyecto
 *                 maxItems: 3
 *                 items:
 *                   type: string
 *                   format: uri
 *                 example: ["https://bucket.s3.amazonaws.com/img1.jpg", "https://bucket.s3.amazonaws.com/img2.jpg"]
 *               imagenes2:
 *                 type: array
 *                 maxItems: 3
 *                 items:
 *                   type: string
 *                   format: uri
 *               imagenes3:
 *                 type: array
 *                 maxItems: 3
 *                 items:
 *                   type: string
 *                   format: uri
 *               repositorio1:
 *                 type: string
 *                 format: uri
 *                 description: Enlace al repositorio del primer proyecto (GitHub, GitLab, etc.)
 *                 example: "https://github.com/usuario/proyecto1"
 *               repositorio2:
 *                 type: string
 *                 format: uri
 *               repositorio3:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Portfolio actualizado correctamente
 *       500:
 *         description: Error interno del servidor
 */
routerPortfolio.put('/updateportfolio/:email', portfolioController.updatePortfolioByEmail)



// Ruta para conseguir tokens de subida segura AUN NO IMPLEMENTADO
/* router.post('/presigned-urls', portfolioController.getPresignedUrls); */

// Ruta para salvar el portfolio final y linkearlo al desarrollador.
// armé todas las rutas sin el requireAuth a ver si podemos no usarlo.
/* 
router.post('/portfolio/:id/presign', portfolioController.presign);
router.post('/portfolio/:id/confirm-upload', portfolioController.confirmUpload); */


//estas son las anteriores.
/* router.post('/', requireAuth, controller.createPortfolio); 
router.post('/:id/presign', requireAuth, controller.presign);
router.post('/:id/confirm-upload', requireAuth, controller.confirmUpload); */

module.exports = routerPortfolio;