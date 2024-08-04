const express = require("express");
const empleadosRouter = express.Router();
const pool = require("../db");

empleadosRouter.get("/", async (req, res) => {
  const [result] = await pool.query("SELECT * FROM Empleados");
  res.json(result);
});

empleadosRouter.get("/:id", async (req, res) => {
  const [result] = await pool.query(
    `SELECT
            *
        FROM Empleados
        WHERE id = ?`,
    [req.params.id]
  );

  if (result.length < 1)
    return res.status(404).json({ error: "Empleado no encontrado" });

  res.json(result[0]);
});

empleadosRouter.post("/", async (req, res) => {
  try {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      curp,
      rfc,
      numero_telefono,
      masculino,
      fecha_nacimiento,
      fecha_inicio,
    } = req.body;

    await pool.query(
      "INSERT INTO Empleados (nombre, apellido_paterno, apellido_materno, curp, rfc, numero_telefono, masculino, fecha_nacimiento, fecha_inicio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nombre,
        apellido_paterno,
        apellido_materno,
        curp,
        rfc,
        numero_telefono,
        masculino,
        fecha_nacimiento,
        fecha_inicio,
      ]
    );
    res.status(200).json({ message: "Empleado agregado con éxito" });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Ocurrió un error al crear el empleado: ${err}` });
  }
});

empleadosRouter.patch("/:id", async (req, res) => {
  try {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      curp,
      rfc,
      numero_telefono,
      masculino,
      fecha_nacimiento,
      fecha_inicio,
    } = req.body;

    const [existingEmpleado] = await pool.query(
      "SELECT * FROM Empleados WHERE id = ?",
      [req.params.id]
    );

    if (existingEmpleado.length < 1)
      return res.status(404).json({ error: "Empleado no encontrado" });

    await pool.query("UPDATE Empleados SET ? WHERE id = ?", [
      {
        nombre: nombre || existingEmpleado[0].nombre,
        apellido_paterno:
          apellido_paterno || existingEmpleado[0].apellido_paterno,
        apellido_materno:
          apellido_materno || existingEmpleado[0].apellido_materno,
        curp: curp || existingEmpleado[0].curp,
        rfc: rfc || existingEmpleado[0].rfc,
        numero_telefono: numero_telefono || existingEmpleado[0].numero_telefono,
        masculino: masculino || existingEmpleado[0].masculino,
        fecha_nacimiento:
          fecha_nacimiento || existingEmpleado[0].fecha_nacimiento,
        fecha_inicio: fecha_inicio || existingEmpleado[0].fecha_inicio,
      },
      req.params.id,
    ]);

    const [updatedEmpleadoResult] = await pool.query(
      "SELECT * FROM Empleados WHERE id = ?",
      [req.params.id]
    );
    res.json(updatedEmpleadoResult[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: `Ocurrió un error al actualizar el empleado: ${err}` });
  }
});

empleadosRouter.delete("/:id", async (req, res) => {
  try {
    const [existingEmpleado] = await pool.query(
      "SELECT * FROM Empleados WHERE id = ?",
      [req.params.id]
    );

    if (existingEmpleado.length < 1) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }

    await pool.query("DELETE FROM Empleados WHERE id = ?", [req.params.id]);

    res.status(200).json({ message: "Empleado eliminado con éxito" });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Ocurrió un error al eliminar el empleado: ${err}` });
  }
});

module.exports = empleadosRouter;
