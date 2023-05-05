const express = require('express');0
const app = express();

//DB
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/pai-3')
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.error(err));

//Model
const productos = require('./Models/productos.model');


app.get('/productos', (req, res) => {
    productos.find().then(allProductos => console.log(allProductos))
});

app.listen(3000, () => console.log('Server Up'));