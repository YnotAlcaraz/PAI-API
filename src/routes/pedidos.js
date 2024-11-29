const express = require("express");
const {
  getPedidos,
  getPedido,
  postPedido,
  patchPedido,
  deletePedido,
} = require("../controllers/pedidos");
const pedidosRouter = express.Router();

pedidosRouter.get("/", getPedidos);
pedidosRouter.get("/:id", getPedido);
pedidosRouter.post("/", postPedido);
pedidosRouter.patch("/:id", patchPedido);
pedidosRouter.delete("/:id", deletePedido);

module.exports = pedidosRouter;
