const pool = require("../db");

const getCategorias = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM Categorias");
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: `Ocurrió un error inesperado al obtener las categorías: ${err}`,
    });
  }
};

const getCategoria = async (req, res) => {
  try {
    const [result] = await pool.query(
      `SELECT
          *
      FROM Categorias
      WHERE id = ?`,
      [req.params.id]
    );

    if (result.length < 1)
      return res.status(404).json({ message: "Categoría no encontrada" });

    return res.status(200).json(result[0]);
  } catch (err) {
    return res.status(500).json({
      message: `Ocurrió un error inesperado al obtener la categoría: ${err}`,
    });
  }
};

const postCategoria = async (req, res) => {
  try {
    const { descripcion } = req.body;

    await pool.query("INSERT INTO Categorias (descripcion) VALUES (?)", [
      descripcion,
    ]);
    return res.status(200).json({ message: "Categoria agregada con éxito" });
  } catch (err) {
    return res.status(500).json({
      message: `Ocurrió un error inesperado al crear la categoría: ${err}`,
    });
  }
};

const patchCategoria = async (req, res) => {
  try {
    const { descripcion } = req.body;
    const [existingCategoria] = await pool.query(
      "SELECT * FROM Categorias WHERE id = ?",
      [req.params.id]
    );
    if (existingCategoria.lenght < 1)
      return res.status(404).json({ message: "Categoria no encontrada" });

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
    return res.status(200).json(updatedCategoriaResult[0]);
  } catch (err) {
    return res.status(500).json({
      message: `Ocurrió un problema al actualizar la categoría: ${err}`,
    });
  }
};

const deleteCategoria = async (req, res) => {
  try {
    const [existingCategoria] = await pool.query(
      "SELECT * FROM Categorias WHERE id = ?",
      [req.params.id]
    );
    if (existingCategoria.length < 1) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }

    await pool.query("DELETE FROM Categorias WHERE id = ?", [req.params.id]);

    return res.status(200).json({ message: "Categoría eliminada con éxito" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Ocurrió un error al eliminar la categoría: ${err}` });
  }
};

module.exports = {
  getCategorias,
  getCategoria,
  postCategoria,
  patchCategoria,
  deleteCategoria,
};
