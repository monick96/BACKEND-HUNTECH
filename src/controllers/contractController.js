
const contractService = require("../services/contractService");

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
  