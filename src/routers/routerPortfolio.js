const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
/* import { requireAuth } from '../middleware/authMiddleware.js' */

// Ruta para obtener el portfolio asociado a un desarrollador
router.get('/portfolio/:email', portfolioController.getPortfolioById)

// Ruta para conseguir tokens de subida segura
router.post('/presigned-urls', portfolioController.getPresignedUrls);

// Ruta para salvar el portfolio final y linkearlo al desarrollador.
// armé todas las rutas sin el requireAuth a ver si podemos no usarlo.
/* router.post('/portfolio/', portfolioController.createPortfolio);
router.post('/portfolio/:id/presign', portfolioController.presign);
router.post('/portfolio/:id/confirm-upload', portfolioController.confirmUpload); */


//estas son las anteriores.
/* router.post('/', requireAuth, controller.createPortfolio); 
router.post('/:id/presign', requireAuth, controller.presign);
router.post('/:id/confirm-upload', requireAuth, controller.confirmUpload); */

module.exports = router;