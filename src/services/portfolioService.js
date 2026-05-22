const portfolioRepository = require("../repositories/portfolioRepository");
const s3Service = require("./s3Service");
const MAX_PORTFOLIOS_POR_DESARROLLADOR = 1;
const MAX_IMAGES_PER_PORTFOLIO = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"];

exports.getPortfolioById = async (email) => {
  try {
    if (!email) {
      throw Error("Se debe indicar el email del usuario a buscar");
    }
    return await portfolioRepository.getPortfolioById(email);
  } catch (error) {
    console.error("SERVICE - Error al buscar portfolio: " + error);
    throw Error("Error al buscar portfolio: " + error.message);
  }
};

exports.chequearSiExistePortfolioParaEseUsuario = async (email) => {
  try {
    if (!email) {
      throw Error("Se debe indicar el email del usuario a buscar");
    }
    return await portfolioRepository.checkIfPorfolioCreated(email);
  } catch (error) {
    console.error("SERVICE - Error al chequear si existe portfolio para ese usuario: " + error);
    throw Error("Error al chequear si existe portfolio para ese usuario: " + error.message);
  }
};


exports.createPortfolio = async (desarrollador_email, portfolio) => {
  /* console.log("asdf",desarrollador_email)
  console.log("portfolio: " ,portfolio) */
  try {
    if (!desarrollador_email) {
      throw Error("Se debe indicar el email del desarrollador");
    }
    
    return await portfolioRepository.createPortfolio( desarrollador_email, portfolio );    
  } catch (error) {
    console.error("SERVICE - Error al crear portfolio: " + error);
    throw Error("Error al crear portfolio: " + error.message);
  }
};

exports.deletePortfolio = async (email) => {
  try {
    if (!email) {
      throw Error("Se debe indicar el email del dueño del portfolio");
    }
    return await portfolioRepository.removePortfolio(email);
  } catch (error) {
    console.error("SERVICE - Error al eliminar portfolio: " + error);
    throw Error("Error al eliminar portfolio: " + error.message);
  }
};

/* ################################# sin uso actual ################################# */

exports.generatePresign = async ({
  desarrollador_email,
  portfolioId,
  fileName,
  contentType,
  size,
}) => {
  if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
    throw { status: 400, message: "Tipo de archivo no permitido" };
  }
  if (size > MAX_FILE_SIZE) {
    throw { status: 400, message: "Archivo excede 5 MB" };
  }

  try {
    // Chequeo de propiedad: se asegura que el desarrollador esté linnkeado a un portfolio
    const p = await repo.getPortfolioById(portfolioId);
    if (!p) throw { status: 404, message: "Portfolio no encontrado" };

    //ESTO NO ES AL RE PEDO? SI EL REPOSITORIO YA BUSCÓ USANDO ID!
    const linkCheck = await client.query(
      `SELECT 1 FROM desarrollador_x_portfolio WHERE desarrollador_email=$1 AND portfolio_id=$2`,
      [desarrollador_email, portfolioId],
    );
    if (linkCheck.rowCount === 0)
      throw Error({ status: 403, message: "No autorizado" });

    // Chequeo de cantidad de imágenes
    const currentImages = p.imagenes || [];
    if (currentImages.length >= MAX_IMAGES_PER_PORTFOLIO) {
      throw Error({ status: 400, message: "Portfolio ya tiene 3 imágenes" });
    }

    // Genera la key y una URL prefirmada (presigned)
    const key = `uploads/${encodeURIComponent(desarrollador_email)}/${portfolioId}/${Date.now()}_${fileName}`;
    const expires = Number(process.env.PRESIGN_EXPIRES || 900);
    const uploadUrl = await s3Service.generatePresignedPutUrl({
      Key: key,
      ContentType: contentType,
      expiresIn: expires,
    });

    return { uploadUrl, key, expiresIn: expires };
  } catch (err) {
    throw Error("Error al crear la presign url: " + err.message);
  }
};

exports.confirmUpload = async ({
  desarrollador_email,
  portfolioId,
  key,
  contentType,
  size,
}) => {
  // Vuelve a validar, del lado del server
  if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
    throw { status: 400, message: "Tipo de archivo no permitido" };
  }
  if (size > MAX_FILE_SIZE) {
    throw { status: 400, message: "Archivo excede 5 MB" };
  }

  try {
    // Chequea propiedad
    const linkCheck = await client.query(
      `SELECT 1 FROM desarrollador_x_portfolio WHERE desarrollador_email=$1 AND portfolio_id=$2`,
      [desarrollador_email, portfolioId],
    );
    if (linkCheck.rowCount === 0)
      throw Error({ status: 403, message: "No autorizado" });

    // Bloqueo de row y checkeo de cantidad
    //ESTA PARTE HAY QUE MANDARLA AL REPOSITORIO, Y SACAR ESTO DE LLAMAR AL CLIENT (ELIMINÉ EL CLIENT DE TODAS ESTAS FUNCIONES LO DEJO ACÁ PARA RECORDAR)
    /*     const q = `SELECT imagenes FROM portfolio WHERE id=$1 FOR UPDATE`;
    const r = await client.query(q, [portfolioId]);
    if (r.rowCount === 0)
      throw Error ({ status: 404, message: "Portfolio no encontrado" });
    const images = r.rows[0].imagenes || [];
    if (images.length >= MAX_IMAGES_PER_PORTFOLIO) {
      throw Error({ status: 400, message: "Portfolio ya tiene 3 imágenes" });
    } */

    // Optional: Objeto tipo HEAD para confirmar existencia, tamaño y content-type
    // ESTO NO SE NI QUE ES
    try {
      const head = await s3Service.headObject({ Key: key });
      const s3ContentLength = Number(head.ContentLength || 0);
      const s3ContentType = head.ContentType;
      if (s3ContentLength !== Number(size)) {
        throw Error({ status: 400, message: "Tamaño en S3 no coincide" });
      }
      if (s3ContentType !== contentType) {
        throw Error({ status: 400, message: "Content-Type en S3 no coincide" });
      }
    } catch (err) {
      // Si HEAD falla, devolver error claro
      if (err.statusCode === 404 || err.name === "NotFound") {
        throw { status: 400, message: "Archivo no encontrado en S3" };
      }
      throw err;
    }

    const url = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    const updated = await repo.appendImageToPortfolio(portfolioId, url);

    return { url, imagenes: updated };
  } catch (err) {
    throw Error(
      "Error al hacer append de la imagen al portfolio: " + err.message,
    );
  }
};
