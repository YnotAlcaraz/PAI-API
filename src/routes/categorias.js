const express = require("express");
const categoriasRouter = express.Router();
const {
  getCategorias,
  getCategoria,
  postCategoria,
  patchCategoria,
  deleteCategoria,
} = require("../controllers/categorias");

categoriasRouter.get("/", getCategorias);
categoriasRouter.get("/:id", getCategoria);
categoriasRouter.post("/", postCategoria);
categoriasRouter.patch("/:id", patchCategoria);
categoriasRouter.delete("/:id", deleteCategoria);

module.exports = categoriasRouter;
