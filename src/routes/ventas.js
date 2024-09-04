const express = require("express");
const {
  getVentas,
  getVenta,
  postVenta,
  patchVenta,
} = require("../controllers/ventas");
const ventasRouter = express.Router();

ventasRouter.get("/", getVentas);
ventasRouter.get("/:id", getVenta);
ventasRouter.post("/", postVenta);
ventasRouter.patch("/:id", patchVenta);

module.exports = ventasRouter;
