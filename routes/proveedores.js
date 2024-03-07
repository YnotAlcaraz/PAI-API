const express = require("express");
const proveedoresRouter = express.Router();
const pool = require("../db");

proveedoresRouter.get("/", async (req, res) => {
  const [result] = await pool.query("SELECT * FROM Proveedores");
  res.json(result);
});

proveedoresRouter.get("/:id", async (req, res) => {
  const [result] = await pool.query(
    `SELECT
            *
        FROM Proveedores
        WHERE id = ?`,
    [req.params.id]
  );

  if (result.length < 1)
    return res.status(404).json({ error: "Proveedor no encontredo" });

  res.json(result[0]);
});

proveedoresRouter.post("/", async (req, res) => {
  try {
    const {
      nombre,
      correo_electronico,
      nombre_empresa,
      numero_telefono,
      direccion,
      direccion_facturacion,
    } = req.body;

    await pool.query(
      "INSERT INTO Proveedores (nombre, correo_electronico, nombre_empresa, numero_telefono, direccion, direccion_facturacion) VALUES (?, ?, ?, ?, ?, ?)",
      [
        nombre,
        correo_electronico,
        nombre_empresa,
        numero_telefono,
        direccion,
        direccion_facturacion,
      ]
    );

    res.status(200).json({ message: "Proveedor agregado con éxito" });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Ocurrió un error al crear el proveedor ${err}` });
  }
});

proveedoresRouter.patch("/:id", async (req, res) => {
  try {
    const {
      nombre,
      correo_electronico,
      nombre_empresa,
      numero_telefono,
      direccion,
      direccion_facturacion,
    } = req.body;

    const [existingProveedor] = await pool.query(
      "SELECT * FROM Proveedores WHERE id = ?",
      [req.params.id]
    );

    if (existingProveedor.length < 1)
      return res.status(404).json({ error: "Proveedor no encontrado" });

    await pool.query("UPDATE Proveedores SET ? WHERE id = ?", [
      {
        nombre: nombre || existingProveedor[0].nombre,
        correo_electronico:
          correo_electronico || existingProveedor[0].correo_electronico,
        nombre_empresa: nombre_empresa || existingProveedor[0].nombre_empresa,
        numero_telefono:
          numero_telefono || existingProveedor[0].numero_telefono,
        direccion: direccion || existingProveedor[0].direccion,
        direccion_facturacion:
          direccion_facturacion || existingProveedor[0].direccion_facturacion,
      },
      req.params.id,
    ]);

    const [updatedProveedorResult] = await pool.query(
      "SELECT * FROM Proveedores WHERE id = ?",
      [req.params.id]
    );
    res.json(updatedProveedorResult[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: `Ocurrió un error al actualizar el producto ${err}` });
  }
});

proveedoresRouter.delete("/:id", async (req, res) => {
  try {
    const [existingProveedor] = await pool.query(
      "SELECT * FROM Proveedores WHERE id = ?",
      [req.params.id]
    );

    if (existingProveedor.length < 1)
      return res.status(400).json({ error: "Proveedor no encontrado" });

    await pool.query("DELETE FROM Proveedores WHERE id = ?", [req.params.id]);

    res.status(200).json({ message: "Proveedor eliminado con éxito" });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Ocurrió un error al eliminar el producto: ${err}` });
  }
});

module.exports = proveedoresRouter;
