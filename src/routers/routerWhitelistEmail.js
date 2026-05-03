const express = require('express');
const multer  = require('multer');
const routerWhitelistEmail = express.Router();
const whitelistEmailController = require('../controllers/whitelistEmailController');

// Endpoint de diagnóstico — no requiere DB ni auth
routerWhitelistEmail.get('/whitelist-email/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        node: process.version,
        env: process.env.NODE_ENV || 'no seteado',
        multerVersion: require('multer/package.json').version,
        csvParseVersion: require('csv-parse/package.json').version,
    });
});

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

module.exports = routerWhitelistEmail;
