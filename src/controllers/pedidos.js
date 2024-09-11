const pool = require("../../db");

const getPedidos = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM Pedidos");
    return res.status(200).json(result);
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Ocurrio un error al obtener los pedidos: ${err}` });
  }
};

const getPedido = async (req, res) => {
  try {
    const [result] = await pool.query(
      `SELECT
              *
          FROM Pedidos
          WHERE id = ?`,
      [req.params.id]
    );

    if (result.length < 1)
      return res.status(404).json({ error: "Pedido no encontrado" });

    return res.status(200).json(result[0]);
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Ocurrio un error al obtener el pedido: ${err}` });
  }
};

const postPedido = async (req, res) => {
  try {
    const { cantidad, entregado, productoId, proveedorId, tipoPagoId } =
      req.body;

    await pool.query(
      "INSERT INTO Pedidos (cantidad, entregado, productoId, proveedorId, tipoPagoId) VALUES (?, ?, ?, ?, ?)",
      [cantidad, entregado, productoId, proveedorId, tipoPagoId]
    );

    return res.status(200).json({ message: "Pedido agregado con éxito" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Ocurrio un error al crear el pedido: ${err}` });
  }
};

const patchPedido = async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const { cantidad, entregado, productoId, proveedorId, tipoPagoId } =
      req.body;

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

    return res.status(200).json(updatedPedidoResult[0]);
  } catch (err) {
    await connection.rollback();
    return res
      .status(500)
      .json({ message: `Ocurrio un error al actualizar el pedido: ${err}` });
  } finally {
    connection.release();
  }
};

const deletePedido = async (req, res) => {
  try {
    const [existingPedido] = await pool.query(
      "SELECT * FROM Pedidos WHERE id = ?",
      [req.params.id]
    );

    if (existingPedido.length < 1)
      return res.status(400).json({ error: "Pedido no encontrado" });

    await pool.query("DELETE FROM Pedidos WHERE id = ?", [req.params.id]);

    return res.status(200).json({ message: "Pedido eliminado con éxito" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Ocurrio un error al eliminar el pedido: ${err}` });
  }
};

module.exports = {
  getPedidos,
  getPedido,
  postPedido,
  patchPedido,
  deletePedido,
};
