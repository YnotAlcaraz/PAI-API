const express = require("express");
const productosRouter = express.Router();
const pool = require("../db");

productosRouter.get("/", async (req, res) => {
  const [result] = await pool.query("SELECT * FROM Productos");
  res.json(result);
});

productosRouter.get("/:id", async (req, res) => {
  const [result] = await pool.query(
    `SELECT
            *
        FROM Productos
        WHERE id = ?`,
    [req.params.id]
  );

  if (result.length < 1)
    return res.status(404).json({ error: "Producto no encontrado" });

  res.json(result[0]);
});

productosRouter.post("/", async (req, res) => {
  try {
    const { codigo, nombre, descripcion, imagen, precio, stock, categoriaId } =
      req.body;

    await pool.query(
      "INSERT INTO Productos (codigo, nombre, descripcion, imagen, precio, stock, categoriaId) VALUES (?,?,?,?,?,?,?)",
      [codigo, nombre, descripcion, imagen, precio, stock, categoriaId]
    );

    res.status(200).json({ message: "Producto agregado con éxito" });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Ocurrió un error al crear el producto: ${err}` });
  }
});

productosRouter.patch("/:id", async (req, res) => {
  try {
    const { codigo, nombre, descripcion, imagen, precio, stock, categoriaId } =
      req.body;

    const [existingProducto] = await pool.query(
      "SELECT * FROM Productos WHERE id = ? ",
      [req.params.id]
    );

    if (existingProducto.length < 1)
      return res.status(404).json({ error: "Producto no encontrado" });

    await pool.query("UPDATE Productos SET ? WHERE id = ?", [
      {
        codigo: codigo || existingProducto[0].codigo,
        nombre: nombre || existingProducto[0].nombre,
        descripcion: descripcion || existingProducto[0].descripcion,
        imagen: imagen || existingProducto[0].imagen,
        precio: precio || existingProducto[0].precio,
        stock: stock || existingProducto[0].stock,
        categoriaId: categoriaId || existingProducto[0].categoriaId,
      },
      req.params.id,
    ]);

    const [updatedProductResult] = await pool.query(
      "SELECT * FROM Productos WHERE id = ?",
      [req.params.id]
    );
    res.json(updatedProductResult[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: `Ocurrió un error al actualizar el producto ${err}` });
  }
});

productosRouter.delete("/:id", async (req, res) => {
  try {
    const [existingProducto] = await pool.query(
      "SELECT * FROM Productos WHERE id = ?",
      [req.params.id]
    );

    if (existingProducto.length < 1) {
      return res.status(400).json({ error: "Producto no encontrado" });
    }

    await pool.query("DELETE FROM Productos WHERE id = ?", [req.params.id]);

    res.status(200).json({ message: "Producto eliminado con éxito" });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Ocurrió un error al eliminar el producto: ${err}` });
  }
});

module.exports = productosRouter;
