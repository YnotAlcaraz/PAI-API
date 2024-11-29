const express = require("express");
const {
  getEmpleados,
  getEmpleado,
  postEmpleado,
  patchEmpleado,
  deleteEmpleado,
} = require("../controllers/empleados");
const empleadosRouter = express.Router();

empleadosRouter.get("/", getEmpleados);
empleadosRouter.get("/:id", getEmpleado);
empleadosRouter.post("/", postEmpleado);
empleadosRouter.patch("/:id", patchEmpleado);
empleadosRouter.delete("/:id", deleteEmpleado);

module.exports = empleadosRouter;
