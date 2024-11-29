const pool = require("../../db");

const getTiposPagos = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM TiposPagos");
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).send({
      message: `Ocurrio un error al obtener los tipos de pago: ${err}`,
    });
  }
};

const getTipoPago = async (req, res) => {
  try {
    const [result] = await pool.query(
      `SELECT
              *
          FROM TiposPagos
          WHERE id = ?`,
      [req.params.id]
    );
    if (result.length < 1)
      return res.status(404).json({ error: "tipo de pago no encontrado" });
    return res.status(200).json(result[0]);
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Ocurrio un error al obtener el tipo de pago: ${err}` });
  }
};

const postTipoPago = async (req, res) => {
  try {
    const { descripcion } = req.body;

    await pool.query("INSERT INTO TiposPagos (descripcion) VALUES (?)", [
      descripcion,
    ]);
    return res.status(200).json({ message: "tipo de pago agregado con éxito" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: `Ocurrio un error al obtener el tipo de pago: ${err}` });
  }
};

const patchTipoPago = async (req, res) => {
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
    return res.status(200).json(updatedTipoPagoResult[0]);
  } catch (err) {
    return res.status(500).send({
      message: `Ocurrio un error al actualizar el tipo de pago: ${err}`,
    });
  }
};

const deleteTipoPago = async (req, res) => {
  try {
    const [existingTipoPago] = await pool.query(
      "SELECT * FROM TiposPagos WHERE id = ?",
      [req.params.id]
    );
    if (existingTipoPago.lenght < 1)
      return res.status(404).json({ error: "TipoPago no encontrado" });

    await pool.query("DELETE FROM TiposPagos WHERE id = ?", [req.params.id]);

    return res
      .status(200)
      .json({ message: "tipo de pago eliminado con éxito" });
  } catch (err) {
    return res.status(500).send({
      message: `Ocurrio un error al eliminar el tipo de pago: ${err}`,
    });
  }
};

module.exports = {
  getTiposPagos,
  getTipoPago,
  postTipoPago,
  patchTipoPago,
  deleteTipoPago,
};
