const express = require("express");
const {
  getTiposPagos,
  getTipoPago,
  postTipoPago,
  patchTipoPago,
  deleteTipoPago,
} = require("../controllers/tipospagos");
const tiposPagosRouter = express.Router();

tiposPagosRouter.get("/", getTiposPagos);
tiposPagosRouter.get("/:id", getTipoPago);
tiposPagosRouter.post("/", postTipoPago);
tiposPagosRouter.patch("/:id", patchTipoPago);
tiposPagosRouter.delete("/:id", deleteTipoPago);

module.exports = tiposPagosRouter;
