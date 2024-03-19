const express = require("express");
const ventasRouter = express.Router();
const pool = require("../db");

ventasRouter.get("/", async (req, res) => {
  const [result] = await pool.query("SELECT * FROM Ventas");

  for (const venta of result) {
    const [productos] = await pool.query(
      "SELECT * FROM VentasProductos WHERE ventaId = ?",
      [venta.id]
    );
    // Se agrega un arreglo al objeto de venta, donde cada elemento del arreglo es un objeto con cantidad y producto id
    venta.productos = [];
    for (const producto of productos) {
      venta.productos.push({
        cantidad: producto.cantidad,
        productoId: producto.productoId,
      });
    }
  }
  res.json(result);
});

ventasRouter.get("/:id", async (req, res) => {
  const [result] = await pool.query(
    `SELECT
            *
        FROM Ventas
        WHERE id = ?`,
    [req.params.id]
  );

  if (result.length < 1)
    return res.status(404).json({ error: "Venta no encontrada" });

  const [foundProductos] = await pool.query(
    `SELECT
        *
    FROM VentasProductos
    WHERE ventaId = ?`,
    [req.params.id]
  );

  result.productos = [];
  for (const e of foundProductos) {
    result.productos.push({
      cantidad: e.cantidad,
      productoId: e.productoId,
    });
  }

  res.json(result[0]);
});

ventasRouter.post("/", async (req, res) => {
  try {
    const { fecha, cancelada, empleadoId, tipoPagoId, productos } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [venta] = await connection.query(
        "INSERT INTO Ventas (fecha, cancelada, empleadoId, tipoPagoId) VALUES (?, ?, ?, ?)",
        [fecha, cancelada, empleadoId, tipoPagoId]
      );
      // Al crear la venta se crean registros en la tabla intermedia
      for (const e of productos) {
        await connection.query(
          "INSERT INTO VentasProductos (cantidad, ventaId, productoId) VALUES (?, ?, ?)",
          [e.cantidad, venta.insertId, e.productoId]
        );

        // Cuando se crea la venta, la cantidad de productos vendidos se resta al stock
        const [foundProducto] = await connection.query(
          "SELECT * FROM Productos WHERE id = ?",
          [e.productoId]
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
            stock: foundProducto[0].stock - e.cantidad,
            categoriaId: foundProducto[0].categoriaId,
          },
          foundProducto[0].id,
        ]);
      }

      await connection.commit();

      res.status(200).json({ message: "Venta creada con éxito" });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: `Ocurrió un error al crear la venta: ${err}` });
  }
});

ventasRouter.patch("/:id", async (req, res) => {
  try {
    const { fecha, cancelada, empleadoId, tipoPagoId, productos } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [existingVenta] = await connection.query(
        "SELECT * FROM Ventas WHERE id = ?",
        [req.params.id]
      );

      if (existingVenta.length < 1) {
        await connection.rollback();
        return res.status(404).json({ error: "Venta no encontrada" });
      }

      await connection.query("UPDATE Ventas SET ? WHERE id = ?", [
        {
          fecha: fecha || existingVenta[0].fecha,
          cancelada: cancelada || existingVenta[0].cancelada,
          empleadoId: empleadoId || existingVenta[0].empleadoId,
          tipoPagoId: tipoPagoId || existingVenta[0].tipoPagoId,
        },
        req.params.id,
      ]);

      // Si se cancela la venta, la cantidad de productos vendidos se agrega al stock
      if (cancelada) {
        for (const e of productos) {
          const [foundProducto] = await connection.query(
            "SELECT * FROM Productos WHERE id = ?",
            [e.productoId]
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
              stock: foundProducto[0].stock + e.cantidad,
              categoriaId: foundProducto[0].categoriaId,
            },
            foundProducto[0].id,
          ]);
        }
      }

      await connection.commit();

      // Se retorna el objeto de venta, con su respectivo arreglo de productos
      const [updatedVentaResult] = await connection.query(
        "SELECT * FROM Ventas WHERE id = ?",
        [req.params.id]
      );

      if (updatedVentaResult.length < 1)
        return res.status(404).json({ error: "Venta no encontrada" });

      const [foundProductos] = await connection.query(
        "SELECT * FROM VentasProductos WHERE ventaId = ?",
        [req.params.id]
      );

      updatedVentaResult[0].productos = [];
      for (const e of foundProductos) {
        updatedVentaResult[0].productos.push({
          cantidad: e.cantidad,
          productoId: e.productoId,
        });
      }

      res.json(updatedVentaResult[0]);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: `Ocurrió un error al actualizar la venta: ${err}` });
  }
});

module.exports = ventasRouter;
