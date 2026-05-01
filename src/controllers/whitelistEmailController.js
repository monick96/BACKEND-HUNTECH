const whitelistEmailService = require('../services/whitelistEmailService');

// TODO [AUTH]: cuando se conecte el sistema de auth de admin, obtener cargado_por
// desde el token del usuario autenticado, ej:
//   const cargado_por = req.user?.email;
// Y proteger estos endpoints con un middleware `requireAdmin` en el router.

/**
 * POST /api/whitelist-email
 * Alta individual (upsert).
 */
exports.createEmail = async (req, res) => {
    try {
        const { email, tipo_usuario, observaciones } = req.body;
        // const cargado_por = req.user?.email; // [AUTH] futuro
        const cargado_por = req.body.cargado_por || null;

        const row = await whitelistEmailService.crearEmailService({
            email,
            tipo_usuario,
            observaciones,
            cargado_por,
        });

        const fueAlta = row.inserted === true;
        res.status(fueAlta ? 201 : 200).json({
            message: fueAlta
                ? 'Email agregado a la whitelist'
                : 'El email ya existía en la whitelist y fue actualizado',
            warning: fueAlta ? null : 'Se actualizó un registro existente en lugar de crear uno nuevo',
            data: {
                id: row.id,
                email: row.email,
                tipo_usuario: row.tipo_usuario,
                estado: row.estado,
                created_at: row.created_at,
                updated_at: row.updated_at,
            },
        });
    } catch (error) {
        console.error('Error al crear email en whitelist: ' + error);
        res.status(400).json({ error: error.message });
    }
};

/**
 * POST /api/whitelist-email/upload
 * Carga masiva mediante archivo CSV (multipart/form-data, campo `file`).
 */
exports.uploadCsv = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se recibió archivo. Adjuntar como campo "file" (multipart/form-data).' });
        }

        // Validación básica de extensión / mimetype
        const nombre = (req.file.originalname || '').toLowerCase();
        if (!nombre.endsWith('.csv')) {
            return res.status(400).json({ error: 'Formato no soportado. Solo se aceptan archivos .csv' });
        }

        // const cargado_por = req.user?.email; // [AUTH] futuro
        const cargado_por = req.body.cargado_por || null;

        const resultado = await whitelistEmailService.procesarCsvService(req.file.buffer, { cargado_por });

        res.status(200).json({
            message: `Carga procesada. Nuevos: ${resultado.insertados}, Actualizados: ${resultado.actualizados}, Errores: ${resultado.errores_count}`,
            success: {
                count: resultado.insertados,
                emails: resultado.nuevos,
                detalle: 'Emails registrados como nuevos en la whitelist',
            },
            warnings: {
                count: resultado.actualizados,
                emails: resultado.warnings,
                detalle: 'Emails que ya existían y fueron actualizados (upsert)',
            },
            errores: {
                count: resultado.errores_count,
                items: resultado.errores,
                detalle: 'Filas que no se pudieron procesar',
            },
            lote_id: resultado.lote_id,
            total_filas: resultado.total_filas,
        });
    } catch (error) {
        console.error('Error al procesar CSV de whitelist: ' + error);
        res.status(400).json({ error: error.message });
    }
};

/**
 * GET /api/whitelist-email
 * Listado paginado con filtros: estado, tipo_usuario, q (búsqueda parcial por email),
 * lote_id, page, page_size.
 */
exports.listEmails = async (req, res) => {
    try {
        const { estado, tipo_usuario, q, lote_id, page, page_size } = req.query;

        const result = await whitelistEmailService.listarEmailsService({
            estado, tipo_usuario, q, lote_id, page, page_size,
        });

        res.status(200).json({
            message: 'Whitelist obtenida correctamente',
            page: result.page,
            page_size: result.page_size,
            total: result.total,
            count: result.data.length,
            data: result.data,
        });
    } catch (error) {
        console.error('Error al listar whitelist: ' + error);
        res.status(400).json({ error: error.message });
    }
};
