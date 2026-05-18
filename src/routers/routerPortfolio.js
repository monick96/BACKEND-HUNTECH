const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
/* import { requireAuth } from '../middleware/authMiddleware.js' */

// Ruta para conseguir tokens de subida segura
router.post('/presigned-urls', portfolioController.getPresignedUrls);

// Ruta para salvar el portfolio final y linkearlo al desarrollador.
// armé todas las rutas sin el requireAuth a ver si podemos no usarlo.
router.post('/', portfolioController.createPortfolio);
router.post('/:id/presign', controller.presign);
router.post('/:id/confirm-upload',  controller.confirmUpload);



/* router.post('/', requireAuth, controller.createPortfolio); 
router.post('/:id/presign', requireAuth, controller.presign);
router.post('/:id/confirm-upload', requireAuth, controller.confirmUpload); */

module.exports = router;