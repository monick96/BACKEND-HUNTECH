const { parse } = require('csv-parse/sync');
const { v4: uuidv4 } = require('uuid');
const whitelistEmailRepository = require('../repositories/whitelistEmailRepository');
const { TIPOS_USUARIO_PERMITIDOS } = require('../utils/constants');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Normalización y validación */
const normalizarEmail = (email) => (email || '').toString().trim().toLowerCase();

const validarTipoUsuario = (tipo) => TIPOS_USUARIO_PERMITIDOS.includes(tipo);

/**
 * Alta o upsert individual.
 */
exports.crearEmailService = async ({ email, tipo_usuario, observaciones, cargado_por }) => {
    const emailNorm = normalizarEmail(email);
    const tipoNorm  = (tipo_usuario || '').toString().trim().toLowerCase();

    if (!emailNorm) throw new Error('El campo email es obligatorio');
    if (!EMAIL_REGEX.test(emailNorm)) throw new Error(`Email con formato inválido: ${emailNorm}`);
    if (!tipoNorm) throw new Error('El campo tipo_usuario es obligatorio');
    if (!validarTipoUsuario(tipoNorm)) {
        throw new Error(`tipo_usuario inválido. Valores permitidos: ${TIPOS_USUARIO_PERMITIDOS.join(', ')}`);
    }

    const row = await whitelistEmailRepository.upsertEmailRepository({
        email: emailNorm,
        tipo_usuario: tipoNorm,
        observaciones,
        cargado_por,
        lote_id: null,
    });

    return row;
};

/**
 * Procesa el buffer de un archivo CSV y devuelve el resultado de la carga
 * masiva con: insertados (success), actualizados (warnings) y errores.
 *
 * Formato esperado del CSV (con cabecera):
 *   email,tipo_usuario,observaciones
 */
exports.procesarCsvService = async (buffer, { cargado_por } = {}) => {
    if (!buffer || !buffer.length) {
        throw new Error('El archivo está vacío o no fue recibido');
    }

    let registros;
    try {
        registros = parse(buffer, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            bom: true,
        });
    } catch (e) {
        throw new Error('No se pudo parsear el CSV: ' + e.message);
    }

    if (!registros.length) {
        throw new Error('El CSV no contiene filas');
    }

    // Validar cabeceras mínimas
    const cabecerasRequeridas = ['email', 'tipo_usuario'];
    const cabecerasArchivo = Object.keys(registros[0] || {}).map((c) => c.toLowerCase().trim());
    const faltantes = cabecerasRequeridas.filter((c) => !cabecerasArchivo.includes(c));
    if (faltantes.length) {
        throw new Error(`Faltan columnas obligatorias en el CSV: ${faltantes.join(', ')}`);
    }

    const validos = [];
    const errores = [];
    const vistosEnArchivo = new Set();

    registros.forEach((reg, idx) => {
        const fila = idx + 2; // +1 por base 1, +1 por la cabecera
        const email = normalizarEmail(reg.email);
        const tipo  = (reg.tipo_usuario || '').toString().trim().toLowerCase();
        const obs   = reg.observaciones ? reg.observaciones.toString().trim() : null;

        if (!email) {
            errores.push({ fila, email: reg.email || null, motivo: 'email vacío' });
            return;
        }
        if (!EMAIL_REGEX.test(email)) {
            errores.push({ fila, email, motivo: 'formato de email inválido' });
            return;
        }
        if (!tipo) {
            errores.push({ fila, email, motivo: 'tipo_usuario vacío' });
            return;
        }
        if (!validarTipoUsuario(tipo)) {
            errores.push({ fila, email, motivo: `tipo_usuario inválido (permitidos: ${TIPOS_USUARIO_PERMITIDOS.join(', ')})` });
            return;
        }
        if (vistosEnArchivo.has(email)) {
            errores.push({ fila, email, motivo: 'email duplicado dentro del archivo' });
            return;
        }
        vistosEnArchivo.add(email);

        validos.push({ email, tipo_usuario: tipo, observaciones: obs });
    });

    let resultadoBd = { insertados: 0, actualizados: 0, detalles: [] };
    const lote_id = uuidv4();

    if (validos.length) {
        resultadoBd = await whitelistEmailRepository.bulkUpsertEmailsRepository(validos, {
            cargado_por,
            lote_id,
        });
    }

    const nuevos = resultadoBd.detalles.filter((d) => d.accion === 'insertado').map((d) => d.email);
    const actualizados = resultadoBd.detalles.filter((d) => d.accion === 'actualizado').map((d) => d.email);

    return {
        lote_id,
        total_filas: registros.length,
        insertados: resultadoBd.insertados,
        actualizados: resultadoBd.actualizados,
        errores_count: errores.length,
        nuevos,        // success: emails nuevos confirmados
        warnings: actualizados, // warnings: emails que ya existían y se actualizaron
        errores,       // errores por fila no procesada
    };
};

/**
 * Listado con filtros y paginación.
 */
exports.listarEmailsService = async ({ estado, tipo_usuario, q, lote_id, page = 1, page_size = 50 }) => {
    const limit  = Math.min(parseInt(page_size, 10) || 50, 200);
    const offset = ((parseInt(page, 10) || 1) - 1) * limit;

    if (estado && !['activo', 'revocado', 'usado'].includes(estado)) {
        throw new Error('estado inválido');
    }
    if (tipo_usuario && !validarTipoUsuario(tipo_usuario)) {
        throw new Error('tipo_usuario inválido');
    }

    const { rows, total } = await whitelistEmailRepository.listEmailsRepository({
        estado, tipo_usuario, q, lote_id, limit, offset,
    });

    return {
        page: parseInt(page, 10) || 1,
        page_size: limit,
        total,
        data: rows,
    };
};
