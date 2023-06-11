const express = require('express');
const router = express.Router();
const path = require('path');

//Debo requerir el controlador
const controllersWeb = require(path.resolve(__dirname, '..', 'controllers', 'controllersWeb'));
//Armo mis rutas
router.get('/', controllersWeb.index);
//router.get('/nosotros', controllersWeb.nosotros);
//router.get('/contacto', controllersWeb.contacto);
module.exports = router;