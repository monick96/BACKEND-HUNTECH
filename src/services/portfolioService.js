const pool = require("../dataBase/conexionPostgres.js")
const portfolioRepository = require('../repositories/portfolioRepository')
const s3Service = require('./s3Service')

const MAX_PORTFOLIOS_PER_DEV = 3;
const MAX_IMAGES_PER_PORTFOLIO = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

exports.createPortfolio = async ({ desarrollador_email, titulo, descripcion }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const count = await portfolioRepository.countPortfoliosByDeveloper(client, desarrollador_email);
    if (count >= MAX_PORTFOLIOS_PER_DEV) {
      throw { status: 400, message: 'Máximo de portfolios alcanzado' };
    }
    const portfolio = await portfolioRepository.createPortfolio(client, { titulo, descripcion });
    await portfolioRepository.linkDeveloperToPortfolio(client, { desarrollador_email, portfolio_id: portfolio.id });
    await client.query('COMMIT');
    return portfolio;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

exports.generatePresign = async ({ desarrollador_email, portfolioId, fileName, contentType, size }) => {
  if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
    throw { status: 400, message: 'Tipo de archivo no permitido' };
  }
  if (size > MAX_FILE_SIZE) {
    throw { status: 400, message: 'Archivo excede 5 MB' };
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Checuqeo de propiedad: se asegura que el desarrollador esté linnkeado a un portfolio
    const p = await repo.getPortfolioById(client, portfolioId);
    if (!p) throw { status: 404, message: 'Portfolio no encontrado' };

    const linkCheck = await client.query(
      `SELECT 1 FROM desarrollador_x_portfolio WHERE desarrollador_email=$1 AND portfolio_id=$2`,
      [desarrollador_email, portfolioId]
    );
    if (linkCheck.rowCount === 0) throw { status: 403, message: 'No autorizado' };

    // Chequeo de cantidad de imágenes 
    const currentImages = p.imagenes || [];
    if (currentImages.length >= MAX_IMAGES_PER_PORTFOLIO) {
      throw { status: 400, message: 'Portfolio ya tiene 3 imágenes' };
    }

    // Genera la key y una URL prefirmada (presigned)
    const key = `uploads/${encodeURIComponent(desarrollador_email)}/${portfolioId}/${Date.now()}_${fileName}`;
    const expires = Number(process.env.PRESIGN_EXPIRES || 900);
    const uploadUrl = await s3Service.generatePresignedPutUrl({ Key: key, ContentType: contentType, expiresIn: expires });

    await client.query('COMMIT');
    return { uploadUrl, key, expiresIn: expires };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

exports.confirmUpload = async ({ desarrollador_email, portfolioId, key, contentType, size }) => {
  // Vuelve a validar, del lado del server
  if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
    throw { status: 400, message: 'Tipo de archivo no permitido' };
  }
  if (size > MAX_FILE_SIZE) {
    throw { status: 400, message: 'Archivo excede 5 MB' };
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Chequea propiedad
    const linkCheck = await client.query(
      `SELECT 1 FROM desarrollador_x_portfolio WHERE desarrollador_email=$1 AND portfolio_id=$2`,
      [desarrollador_email, portfolioId]
    );
    if (linkCheck.rowCount === 0) throw { status: 403, message: 'No autorizado' };

    // Bloqueo de row y checkeo de cantidad 
    const q = `SELECT imagenes FROM portfolio WHERE id=$1 FOR UPDATE`;
    const r = await client.query(q, [portfolioId]);
    if (r.rowCount === 0) throw { status: 404, message: 'Portfolio no encontrado' };
    const images = r.rows[0].imagenes || [];
    if (images.length >= MAX_IMAGES_PER_PORTFOLIO) {
      throw { status: 400, message: 'Portfolio ya tiene 3 imágenes' };
    }

    // Optional: Objeto tipo HEAD para confirmar existencia, tamaño y content-type
    try {
      const head = await s3Service.headObject({ Key: key });
      const s3ContentLength = Number(head.ContentLength || 0);
      const s3ContentType = head.ContentType;
      if (s3ContentLength !== Number(size)) {
        throw { status: 400, message: 'Tamaño en S3 no coincide' };
      }
      if (s3ContentType !== contentType) {
        throw { status: 400, message: 'Content-Type en S3 no coincide' };
      }
    } catch (err) {
      // Si HEAD falla, devolver error claro
      if (err.statusCode === 404 || err.name === 'NotFound') {
        throw { status: 400, message: 'Archivo no encontrado en S3' };
      }
      throw err;
    }

    const url = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    const updated = await repo.appendImageToPortfolio(client, portfolioId, url);

    await client.query('COMMIT');
    return { url, imagenes: updated };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
