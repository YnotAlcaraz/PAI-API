const express = require("express");
const tiposPagosRouter = express.Router();
const pool = require("../db");

tiposPagosRouter.get("/", async (req, res) => {
  const [result] = await pool.query("SELECT * FROM TiposPagos");
  res.json(result);
});

tiposPagosRouter.get("/:id", async (req, res) => {
  const [result] = await pool.query(
    `SELECT
            *
        FROM TiposPagos
        WHERE id = ?`,
    [req.params.id]
  );
  if (result.length < 1)
    return res.status(404).json({ error: "TipoPago no encontrado" });
  res.json(result[0]);
});

tiposPagosRouter.post("/", async (req, res) => {
  try {
    const { descripcion } = req.body;

    await pool.query("INSERT INTO TiposPagos (descripcion) VALUES (?)", [
      descripcion,
    ]);
    res.status(200).json({ message: "TipoPago agregado con éxito" });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Ocurrió un error al encontrar el TipoPago: ${err}` });
  }
});

tiposPagosRouter.patch("/:id", async (req, res) => {
  try {
    const { descripcion } = req.body;
    const [existingTipoPago] = await pool.query(
      "SELECT * FROM TiposPagos WHERE id = ?",
      [req.params.id]
    );
    if (existingTipoPago.lenght < 1)
      return res.status(404).json({ error: "TipoPago no encontrado" });

    await pool.query("UPDATE TiposPagos SET ? WHERE id = ?", [
      {
        descripcion: descripcion || existingTipoPago[0].descripcion,
      },
      req.params.id,
    ]);

    const [updatedTipoPagoResult] = await pool.query(
      "SELECT * FROM TiposPagos WHERE id = ?",
      [req.params.id]
    );
    res.json(updatedTipoPagoResult[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: `Ocurrió un problema al actualizar el TipoPago: ${err}` });
  }
});

tiposPagosRouter.delete("/:id", async (req, res) => {
  try {
    const [existingTipoPago] = await pool.query(
      "SELECT * FROM TiposPagos WHERE id = ?",
      [req.params.id]
    );
    if (existingTipoPago.lenght < 1)
      return res.status(404).json({ error: "TipoPago no encontrado" });

    await pool.query("DELETE FROM TiposPagos WHERE id = ?", [req.params.id]);

    res.status(200).json({ message: "TipoPago eliminado con éxito" });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Ocurrió un error al eliminar el TipoPago: ${err}` });
  }
});

module.exports = tiposPagosRouter;
