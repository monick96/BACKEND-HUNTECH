const pool = require('../dataBase/conexionPostgres');

/**
 * Inserta un email en la whitelist. Si ya existe (UNIQUE email), hace UPDATE
 * (upsert) reactivando el registro y refrescando metadatos. Devuelve la fila
 * resultante junto con un flag `inserted` que indica si fue alta o actualización.
 */
exports.upsertEmailRepository = async ({ email, tipo_usuario, observaciones, cargado_por, lote_id }) => {
    const query = `
        INSERT INTO whitelist_email (email, tipo_usuario, observaciones, cargado_por, lote_id)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO UPDATE
            SET tipo_usuario  = EXCLUDED.tipo_usuario,
                observaciones = COALESCE(EXCLUDED.observaciones, whitelist_email.observaciones),
                cargado_por   = EXCLUDED.cargado_por,
                lote_id       = EXCLUDED.lote_id,
                estado        = 'activo',
                updated_at    = NOW()
        RETURNING *,
                  (xmax = 0) AS inserted;
    `;
    const values = [email, tipo_usuario, observaciones || null, cargado_por || null, lote_id || null];
    const result = await pool.query(query, values);
    return result.rows[0];
};

/**
 * Versión transaccional para carga masiva. Recibe un array de registros ya
 * validados/normalizados y los upserta dentro de una única transacción.
 * Retorna { insertados, actualizados, detalles[] }.
 */
exports.bulkUpsertEmailsRepository = async (registros, { cargado_por, lote_id }) => {
    const client = await pool.connect();
    const detalles = [];
    let insertados = 0;
    let actualizados = 0;

    try {
        await client.query('BEGIN');

        const query = `
            INSERT INTO whitelist_email (email, tipo_usuario, observaciones, cargado_por, lote_id)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (email) DO UPDATE
                SET tipo_usuario  = EXCLUDED.tipo_usuario,
                    observaciones = COALESCE(EXCLUDED.observaciones, whitelist_email.observaciones),
                    cargado_por   = EXCLUDED.cargado_por,
                    lote_id       = EXCLUDED.lote_id,
                    estado        = 'activo',
                    updated_at    = NOW()
            RETURNING email, tipo_usuario, estado, (xmax = 0) AS inserted;
        `;

        for (const reg of registros) {
            const values = [reg.email, reg.tipo_usuario, reg.observaciones || null, cargado_por || null, lote_id];
            const result = await client.query(query, values);
            const row = result.rows[0];
            if (row.inserted) {
                insertados++;
                detalles.push({ email: row.email, accion: 'insertado' });
            } else {
                actualizados++;
                detalles.push({ email: row.email, accion: 'actualizado' });
            }
        }

        await client.query('COMMIT');
        return { insertados, actualizados, detalles };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('REPOSITORY - Error en bulkUpsertEmailsRepository: ' + error);
        throw new Error('Error en carga masiva de emails: ' + error.message);
    } finally {
        client.release();
    }
};

/**
 * Listado paginado con filtros opcionales.
 */
exports.listEmailsRepository = async ({ estado, tipo_usuario, q, lote_id, limit = 50, offset = 0 }) => {
    const conds = [];
    const values = [];
    let i = 1;

    if (estado)        { conds.push(`estado = $${i++}`);              values.push(estado); }
    if (tipo_usuario)  { conds.push(`tipo_usuario = $${i++}`);        values.push(tipo_usuario); }
    if (lote_id)       { conds.push(`lote_id = $${i++}`);             values.push(lote_id); }
    if (q)             { conds.push(`email ILIKE $${i++}`);           values.push(`%${q}%`); }

    const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';

    const dataQuery = `
        SELECT id, email, tipo_usuario, estado, cargado_por, lote_id, observaciones, created_at, updated_at
        FROM whitelist_email
        ${where}
        ORDER BY created_at DESC
        LIMIT $${i++} OFFSET $${i++};
    `;
    const countQuery = `SELECT COUNT(*)::int AS total FROM whitelist_email ${where};`;

    const dataValues  = [...values, limit, offset];
    const countValues = values;

    const [dataRes, countRes] = await Promise.all([
        pool.query(dataQuery, dataValues),
        pool.query(countQuery, countValues),
    ]);

    return { rows: dataRes.rows, total: countRes.rows[0].total };
};
