
const portfolioService = require("../services/portfolioService")

exports.readContracts = async (req, res) => {
  try {
    (result = await contractService.getAllContracts()),

      res.status(200);
    res.json({
      message: "contratos obtenidos correctamente",
      count: result.length,
      data: result,

    });
  } catch (error) {
    console.error("Error al obtener contratos: " + error);
    res.status(500);
    res.json({ error: "Error al obtener contratos: " + error.message });
  }
};

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

exports.createPortfolio = async (req, res, next) => {
    try {
        const { email, titulo, descripcion, imagenes } = req.body;
        
        if (!email || !titulo) {
            return res.status(400).json({ error: 'Email and Title are required' });
        }
        if (imagenes && imagenes.length > 3) {
            return res.status(400).json({ error: 'A portfolio cannot exceed 3 images' });
        }

        const newPortfolio = await portfolioService.savePortfolioWithDeveloper(email, { titulo, descripcion, imagenes });
        return res.status(201).json(newPortfolio);
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