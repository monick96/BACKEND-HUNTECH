const express = require("express");
const routerContrato = express.Router();
const contractController = require("../controllers/contractController");
///uno pensaria qque solo logea si apuntamos a 
// /api/contratos pero logea cualquier peticion de cualquier router
routerContrato.use((req, res, next) => {
  console.log(`[CONTRATOS] ${req.method} ${req.originalUrl}`);
  next();
});

/* ## Todos los contratos libres ## */
/**
 * @swagger
 * /api/contratoslibres:
 *   get:
 *     summary: Busca contratos que no hayan sido asignados ya a un desarrollador.
 *     tags:
 *       - Contratos
 *     parameters:
 *     responses:
 *       200:
 *         description: Se hallaron contratos
 *       500:
 *         description: Error al buscar contratos.
 */
routerContrato.get(
  "/contratoslibres",
  contractController.readNonOccupiedContracts,
);

/* ## Contratos By Gerente ## */
/**
 * @swagger
 * /api/contratos/{email_gerente}:
 *   get:
 *     summary: Busca contratos asociados a proyecto asociado a gerente.
 *     tags:
 *       - Contratos
 *     parameters:
 *       - in: path
 *         name: emailgerente
 *         required: true
 *         description: Email del gerente cuyos contratos buscar
 *         schema:
 *           type: string
 *           example: pepito@gmail.com
 *     responses:
 *       200:
 *         description: Se realizó la petición y volvió correctamente.
 *       500:
 *         description: Error al buscar contratos.
 */

routerContrato.get(
  "/contratos/:emailgerente",
  contractController.readContractsByGerenteEmail,
);
routerContrato.post("/contrato", contractController.createContract);
routerContrato.put("/contrato/:id/", contractController.updateContract);
routerContrato.put(
  "/contrato/asignar/:id/",
  contractController.asignarCandidato,
);
routerContrato.delete("/contrato/:id", contractController.deleteContract);

module.exports = routerContrato;
