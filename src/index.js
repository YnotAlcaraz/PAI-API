const express = require("express");
const { config } = require("dotenv");
const pool = require("../db");
const cors = require('cors');

config();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Proyecto de Administracion de Inventario");
});

app.get("/ping", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result[0]);
});

const empleadosRouter = require("../routes/empleados");
const categoriasRouter = require("../routes/categorias");
const tiposPagosRouter = require("../routes/tipospagos");
const productosRouter = require("../routes/productos");
const proveedoresRouter = require("../routes/proveedores");
const pedidosRouter = require("../routes/pedidos");
const ventasRouter = require("../routes/ventas");

app.use("/empleados", empleadosRouter);
app.use("/categorias", categoriasRouter);
app.use("/tipospagos", tiposPagosRouter);
app.use("/productos", productosRouter);
app.use("/proveedores", proveedoresRouter);
app.use("/pedidos", pedidosRouter);
app.use("/ventas", ventasRouter);

app.listen(process.env.NODE_DOCKER_PORT);
console.log("Server on port", process.env.NODE_DOCKER_PORT);
