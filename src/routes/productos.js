const express = require("express");
const {
  getProductos,
  getProducto,
  postProducto,
  patchProducto,
  deleteProducto,
} = require("../controllers/productos");
const productosRouter = express.Router();

productosRouter.get("/", getProductos);
productosRouter.get("/:id", getProducto);
productosRouter.post("/", postProducto);
productosRouter.patch("/:id", patchProducto);
productosRouter.delete("/:id", deleteProducto);

module.exports = productosRouter;
