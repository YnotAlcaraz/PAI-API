const mongoose = require('mongoose');
const productoSchema = mongoose.Schema({
    id: Number,
    codigo_de_barras: Number,
    nombre: String,
    descripcion: String,
    imagen_del_producto: String,
    precio_de_venta: Number,
    cantidad: Number,
    categoria: Number
})

const productos = mongoose.model('productos', productoSchema);

module.exports = productos;