const pool = require("../../db");

const getProveedores = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM Proveedores");
    return res.status(200).json(result);
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Ocurrio un error al obtener los proveedores: ${err}` });
  }
};

const getProveedor = async (req, res) => {
  try {
    const [result] = await pool.query(
      `SELECT
              *
          FROM Proveedores
          WHERE id = ?`,
      [req.params.id]
    );

    if (result.length < 1)
      return res.status(404).json({ error: "Proveedor no encontredo" });

    return res.status(200).json(result[0]);
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Ocurrio un error al obtener el proveedor: ${err}` });
  }
};

const postProveedor = async (req, res) => {
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

    return res.status(200).json({ message: "Proveedor agregado con éxito" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Ocurrio un error al crear el proveedor: ${err}` });
  }
};

const patchProveedor = async (req, res) => {
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
    return res.status(200).json(updatedProveedorResult[0]);
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Ocurrio un error al actualizar el proveedor: ${err}` });
  }
};

const deleteProveedor = async (req, res) => {
  try {
    const [existingProveedor] = await pool.query(
      "SELECT * FROM Proveedores WHERE id = ?",
      [req.params.id]
    );

    if (existingProveedor.length < 1)
      return res.status(400).json({ error: "Proveedor no encontrado" });

    await pool.query("DELETE FROM Proveedores WHERE id = ?", [req.params.id]);

    return res.status(200).json({ message: "Proveedor eliminado con éxito" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Ocurrio un error al eliminar el proveedor: ${err}` });
  }
};

module.exports = {
  getProveedores,
  getProveedor,
  postProveedor,
  patchProveedor,
  deleteProveedor,
};
