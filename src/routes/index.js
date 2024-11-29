const express = require("express");
const empleadosRouter = require("./empleados");
const categoriasRouter = require("./categorias");
const tiposPagosRouter = require("./tipospagos");
const productosRouter = require("./productos");
const proveedoresRouter = require("./proveedores");
const pedidosRouter = require("./pedidos");
const ventasRouter = require("./ventas");

const router = express.Router();

router.use("/empleados", empleadosRouter);
router.use("/categorias", categoriasRouter);
router.use("/tipospagos", tiposPagosRouter);
router.use("/productos", productosRouter);
router.use("/proveedores", proveedoresRouter);
router.use("/pedidos", pedidosRouter);
router.use("/ventas", ventasRouter);

module.exports = router;
