const express = require("express");
const categoriasRouter = express.Router();
const pool = require("../db");

categoriasRouter.get("/", async (req, res) => {
  const [result] = await pool.query("SELECT * FROM Categorias");
  res.json(result);
});

categoriasRouter.get("/:id", async (req, res) => {
  const [result] = await pool.query(
    `SELECT
        *
    FROM Categorias
    WHERE id = ?`,
    [req.params.id]
  );

  if (result.length < 1)
    return res.status(404).json({ error: "Categoría no encontrada" });

  res.json(result[0]);
});

categoriasRouter.post("/", async (req, res) => {
  try {
    const { descripcion } = req.body;

    await pool.query("INSERT INTO Categorias (descripcion) VALUES (?)", [
      descripcion,
    ]);
    res.status(200).json({ message: "Categoria agregada con éxito" });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Ocurrió un error al crear la categoría: ${err}` });
  }
});

categoriasRouter.patch("/:id", async (req, res) => {
  try {
    const { descripcion } = req.body;
    const [existingCategoria] = await pool.query(
      "SELECT * FROM Categorias WHERE id = ?",
      [req.params.id]
    );
    if (existingCategoria.lenght < 1)
      return res.status(404).json({ error: "Categoria no encontrada" });

    await pool.query("UPDATE Categorias SET ? WHERE id = ?", [
      {
        descripcion: descripcion || existingCategoria[0].descripcion,
      },
      req.params.id,
    ]);

    const [updatedCategoriaResult] = await pool.query(
      "SELECT * FROM Categorias WHERE id = ?",
      [req.params.id]
    );
    res.json(updatedCategoriaResult[0]);
  } catch (err) {
    res.status(500).json({
      error: `Ocurrió un problema al actualizar la categoria: ${err}`,
    });
  }
});

categoriasRouter.delete("/:id", async (req, res) => {
  try {
    const [existingCategoria] = await pool.query(
      "SELECT * FROM Categorias WHERE id = ?",
      [req.params.id]
    );
    if (existingCategoria.length < 1) {
      return res.status(404).json({ error: "Categoria no encontrada" });
    }

    await pool.query("DELETE FROM Categorias WHERE id = ?", [req.params.id]);

    res.status(200).json({ message: "Categoría eliminada con éxito" });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Ocurrió un error al eliminar la categoria: ${err}` });
  }
});

module.exports = categoriasRouter;
