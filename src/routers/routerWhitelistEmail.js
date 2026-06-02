const express = require('express');
const multer  = require('multer');
const routerWhitelistEmail = express.Router();
const whitelistEmailController = require('../controllers/whitelistEmailController');

// TODO [AUTH]: agregar middleware requireAdmin cuando esté disponible el sistema
// de autenticación. Ej:
//   const requireAdmin = require('../middlewares/requireAdmin');
//   routerWhitelistEmail.use(requireAdmin);

// Multer en memoria: el CSV se procesa en RAM y nunca se guarda en disco.
// Limite 2 MB para evitar abuso de upload.
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 },
});

/**
 * @swagger
 * tags:
 *   - name: WhitelistEmail
 *     description: Gestión de emails autorizados a registrarse en la plataforma
 */

/**
 * @swagger
 * /api/whitelist-email:
 *   post:
 *     summary: Alta individual (upsert) de un email autorizado
 *     tags: [WhitelistEmail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, tipo_usuario]
 *             properties:
 *               email:
 *                 type: string
 *                 example: alumno@iescolar.edu.ar
 *               tipo_usuario:
 *                 type: string
 *                 enum: [desarrollador, gerente, institucion_educativa]
 *               observaciones:
 *                 type: string
 *                 example: Comisión 3°A 2026
 *     responses:
 *       201:
 *         description: Email agregado a la whitelist
 *       200:
 *         description: Email ya existente, se actualizó (warning)
 *       400:
 *         description: Datos inválidos
 */
routerWhitelistEmail.post('/whitelist-email', whitelistEmailController.createEmail);

/**
 * @swagger
 * /api/whitelist-email/upload:
 *   post:
 *     summary: Carga masiva de emails mediante archivo CSV
 *     description: |
 *       Sube un archivo CSV con cabeceras `email,tipo_usuario,observaciones`.
 *       Aplica upsert: los emails existentes se actualizan (warning),
 *       los nuevos se insertan (success), las filas inválidas se devuelven en `errores`.
 *     tags: [WhitelistEmail]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo .csv
 *     responses:
 *       200:
 *         description: Carga procesada con detalle de éxitos, warnings y errores
 *       400:
 *         description: Error en el archivo o en su contenido
 */
routerWhitelistEmail.post('/whitelist-email/upload', upload.single('file'), whitelistEmailController.uploadCsv);

/**
 * @swagger
 * /api/whitelist-email:
 *   get:
 *     summary: Lista la whitelist de emails con filtros y paginación
 *     tags: [WhitelistEmail]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema: { type: string, enum: [activo, revocado, usado] }
 *       - in: query
 *         name: tipo_usuario
 *         schema: { type: string, enum: [desarrollador, gerente, institucion_educativa] }
 *       - in: query
 *         name: q
 *         description: Búsqueda parcial por email (ILIKE)
 *         schema: { type: string }
 *       - in: query
 *         name: lote_id
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: page_size
 *         schema: { type: integer, default: 50, maximum: 200 }
 *     responses:
 *       200:
 *         description: Listado paginado
 */
routerWhitelistEmail.get('/whitelist-email', whitelistEmailController.listEmails);

/**
 * @swagger
 * /api/whitelist-email/verificar/{email}:
 *   get:
 *     summary: Verifica si un email está en la whitelist (verificado)
 *     tags: [WhitelistEmail]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email a verificar
 *         schema:
 *           type: string
 *           example: dev@ejemplo.com
 *     responses:
 *       200:
 *         description: Estado de verificación del email
 *       400:
 *         description: Email inválido
 */
routerWhitelistEmail.get('/whitelist-email/verificar/:email', whitelistEmailController.verificarEmail);

/**
 * @swagger
 * /api/whitelist-email/verificar-batch:
 *   post:
 *     summary: Verifica múltiples emails contra la whitelist (batch)
 *     description: |
 *       Recibe un array de emails y retorna cuáles están verificados.
 *       Ideal para el panel del gerente que necesita mostrar el check
 *       de verificado en la lista de postulantes.
 *     tags: [WhitelistEmail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [emails]
 *             properties:
 *               emails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["dev1@mail.com", "dev2@mail.com"]
 *     responses:
 *       200:
 *         description: Resultado de verificación por email
 *       400:
 *         description: Datos inválidos
 */
routerWhitelistEmail.post('/whitelist-email/verificar-batch', whitelistEmailController.verificarEmailsBatch);

module.exports = routerWhitelistEmail;
