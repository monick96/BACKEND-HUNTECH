
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

exports.readNonOccupiedContracts = async (req, res) => {
    try {
      (result = await contractService.getAllNonOccuppiedContracts()),

        res.status(200);
        res.json({
        message: "contratos libres obtenidos correctamente",
        count: result.length,
        data: result,

      });
    } catch (error) {
      console.error("Error al obtener contratos libres: " + error);
      res.status(500);
      res.json({ error: "Error al obtener contratos librs: " + error.message });
    }
  };
  
  
exports.readContractsByGerenteEmail = async (req, res) => {
  try {
    let emailGerente = req.body;
    (result = await contractService.getContractsByGerenteEmail(emailGerente)),
      res.status(200);
    res.json({
      message: `contratos obtenidos correctamnte`,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error(
      `Error al obtener contratos para el gerente ${req.body.emailGerente} ` +
        error
    );
    res.status(500);
    res.json({
      error:
        `Error al obtener contratos para el gerente ${req.body} ` +
        error.message,
    });
  }
};

exports.createContract = async (req, res) => {
  try {
    let contract = req.body;
    //retorna id del contrato creado o error
    result = await contractService.createContract(contract);
    res.status(201);
    res.json({ message: "contrato creado", contractId: result });
  } catch (error) {
    console.error("Error al crear contrato: " + error);
    res.status(500);
    res.json({ error: "Error al crear contratos: " + error.message });
  }
};

exports.updateContract = async (req, res) => {
  try {
    const contractUpdated = req.body;
    const id = req.params.id;
    const contrato = await contractService.updateContract(id, contractUpdated);
    
    if (contrato.length === 0) {
      return res
        .status(404)
        .send(`No se encuentra un contrato a modificar con la id: ${id}`);
    }
    res.status(200)
    res.json({
      message: "contrato actualizado",
      data: contrato,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: "Error al actualizar el contrato: " + error.message,
    });
    throw Error("ERROR 500");
  
  }
};
  