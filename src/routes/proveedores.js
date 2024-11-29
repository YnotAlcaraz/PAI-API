const express = require("express");
const {
  getProveedores,
  getProveedor,
  postProveedor,
  patchProveedor,
  deleteProveedor,
} = require("../controllers/proveedores");
const proveedoresRouter = express.Router();

proveedoresRouter.get("/", getProveedores);
proveedoresRouter.get("/:id", getProveedor);
proveedoresRouter.post("/", postProveedor);
proveedoresRouter.patch("/:id", patchProveedor);
proveedoresRouter.delete("/:id", deleteProveedor);

module.exports = proveedoresRouter;
