const express = require("express");
const pedidosRouter = express.Router();
const pool = require("../db");

pedidosRouter.get("/", async (req, res) => {
  const [result] = await pool.query("SELECT * FROM Pedidos");
  res.json(result);
});

pedidosRouter.get("/:id", async (req, res) => {
  const [result] = await pool.query(
    `SELECT
            *
        FROM Pedidos
        WHERE id = ?`,
    [req.params.id]
  );

  if (result.length < 1)
    return res.status(404).json({ error: "Pedido no encontrado" });

  res.json(result[0]);
});

pedidosRouter.post("/", async (req, res) => {
  try {
    const { cantidad, entregado, productoId, proveedorId, tipoPagoId } =
      req.body;

    await pool.query(
      "INSERT INTO Pedidos (cantidad, entregado, productoId, proveedorId, tipoPagoId) VALUES (?, ?, ?, ?, ?)",
      [cantidad, entregado, productoId, proveedorId, tipoPagoId]
    );

    res.status(200).json({ message: "Pedido agregado con éxito" });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Ocurrió un error al crear el pedido: ${err}` });
  }
});

pedidosRouter.patch("/:id", async (req, res) => {
  try {
    const { cantidad, entregado, productoId, proveedorId, tipoPagoId } =
      req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    const [existingPedido] = await connection.query(
      "SELECT * FROM Pedidos WHERE id = ?",
      [req.params.id]
    );

    if (existingPedido.length < 1) {
      await connection.rollback();
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    await connection.query("UPDATE Pedidos SET ? WHERE id = ?", [
      {
        cantidad: cantidad || existingPedido[0].cantidad,
        entregado: entregado || existingPedido[0].entregado,
        productoId: productoId || existingPedido[0].productoId,
        proveedorId: proveedorId || existingPedido[0].proveedorId,
        tipoPagoId: tipoPagoId || existingPedido[0].tipoPagoId,
      },
      req.params.id,
    ]);

    if (entregado) {
      // Si el pedido se marca como entregado, la cantidad de producto pedido se agrega al stock
      const [foundProducto] = await connection.query(
        "SELECT * FROM Productos WHERE id = ?",
        [productoId]
      );
      if (foundProducto.length < 1) {
        await connection.rollback();
        return res
          .status(404)
          .json({ error: "No se encontró el producto asociado" });
      }

      await connection.query("UPDATE Productos SET ? WHERE id = ?", [
        {
          codigo: foundProducto[0].codigo,
          nombre: foundProducto[0].nombre,
          descripcion: foundProducto[0].descripcion,
          imagen: foundProducto[0].imagen,
          precio: foundProducto[0].precio,
          stock: foundProducto[0].stock + cantidad,
          categoriaId: foundProducto[0].categoriaId,
        },
        foundProducto[0].id,
      ]);
    }

    await connection.commit();

    const [updatedPedidoResult] = await connection.query(
      "SELECT * FROM Pedidos WHERE id = ?",
      [req.params.id]
    );

    res.json(updatedPedidoResult[0]);
  } catch (err) {
    await connection.rollback();
    res
      .status(500)
      .json({ error: `Ocurrió un error al actualizar el pedido: ${err}` });
  } finally {
    connection.release();
  }
});

pedidosRouter.delete("/:id", async (req, res) => {
  try {
    const [existingPedido] = await pool.query(
      "SELECT * FROM Pedidos WHERE id = ?",
      [req.params.id]
    );

    if (existingPedido.length < 1)
      return res.status(400).json({ error: "Pedido no encontrado" });

    await pool.query("DELETE FROM Pedidos WHERE id = ?", [req.params.id]);

    res.status(200).json({ message: "Pedido eliminado con éxito" });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Ocurrió un error al eliminar el pedido: ${err}` });
  }
});

module.exports = pedidosRouter;
