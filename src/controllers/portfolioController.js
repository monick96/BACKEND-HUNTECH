
const portfolioService = require("../services/portfolioService")

exports.getPortfolioById = async (req, res) => {
  try {
    let email = req.params.email;
    (result = await portfolioService.getPortfolioById(email)),
    res.status(200);
    if (result == undefined) {
      res.json({
      message: `El usuario no tiene portfolio creado`,
      //count: result.length,
      data: 0,
    });  
    } else {
      res.json({
      message: `portfolio obtenido correctamente`,
      //count: result.length,
      data: result,
    });
    }
    
  } catch (error) {
    console.error(
      `Error al obtener portfolio para el desarrollador ${req.params.email} ` +
      error
    );
    res.status(500);
    res.json({
      error:
        `Error al obtener portfolio para el gerente ${req.params.email} ` +
        error.message,
    });
  }
};

exports.createPortfolio = async (req, res) => {
    try {
        let email = req.params.email
        let portfolio = req.body;

        const portfolioYaCreado = await portfolioService.chequearSiExistePortfolioParaEseUsuario(req.params.email);
        if (portfolioYaCreado == 1) {
            return res.status(400).json({ message: 'Ya existe un un repositorio para ese usuario' });
        }

        const { imagenes1, imagenes2, imagenes3 } = portfolio;
        
        if (imagenes1 && imagenes1.length > 3) {
            return res.status(400).json({ error: 'Un proyecto de portfolio no puede tener más de 3 imagenes' });
        }
        if (imagenes2 && imagenes2.length > 3) {
            return res.status(400).json({ error: 'Un proyecto de portfolio no puede tener más de 3 imagenes' });
        }
        if (imagenes3 && imagenes3.length > 3) {
            return res.status(400).json({ error: 'Un proyecto de portfolio no puede tener más de 3 imagenes' });
        }

        result = await portfolioService.createPortfolio(email, portfolio)
        res.status(201);
        res.json ({ message: 'portfolio creado', email_portfolio: result })
    } catch (error) {
        console.error('Desde el controller: error al crear portfolio: ' + error);
        res.status(500)
        res.json({ error: 'Error al crear portfolio: ' + error.message });
    }
};

exports.deletePortfolio = async (req, res) => {
    try {
        let email = req.params.email
        result = await portfolioService.deletePortfolio(email)
        res.status(200);
        res.json({ message: 'portfolio eliminado', desarrollador_email: result });

    } catch (error) {
        console.error('Error al eliminar portfolio: ' + error);
        res.status(500)
        res.json({ error: 'Error al elimninar portfolio: ' + error.message });
    }
}


/* ################################# de acá en más no está en uso  ################################# */
exports.getPresignedUrls = async (req, res, next) => {
    try {
        const { files } = req.body; // Array of { fileName, fileType }
        if (!files || files.length > 3) {
            return res.status(400).json({ error: 'Maximum 3 files allowed' });
        }
        const urls = await portfolioService.generateUploadUrls(files);
        return res.status(200).json(urls);
    } catch (error) {
        next(error);
    }
};

exports.presign = async (req, res, next) => {
  try {
    const desarrollador_email = req.user.email;
    const portfolioId = Number(req.params.id);
    const { fileName, contentType, size } = req.body;
    if (!fileName || !contentType || typeof size !== 'number') {
      return res.status(400).json({ error: 'fileName, contentType y size son requeridos' });
    }
    const data = await portfolioService.generatePresign({ desarrollador_email, portfolioId, fileName, contentType, size });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

exports.confirmUpload = async (req, res, next) => {
  try {
    const desarrollador_email = req.user.email;
    const portfolioId = Number(req.params.id);
    const { key, contentType, size } = req.body;
    if (!key || !contentType || typeof size !== 'number') {
      return res.status(400).json({ error: 'key, contentType y size son requeridos' });
    }
    const data = await portfolioService.confirmUpload({ desarrollador_email, portfolioId, key, contentType, size });
    res.json(data);
  } catch (err) {
    next(err);
  }
}