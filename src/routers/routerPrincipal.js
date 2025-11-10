const express = require('express');
const routerPrincipal = express.Router();
const DOC = require('../utils/doc')

//ruta que apunta a la ruta raiz del proyecto -retorna la documentacion
//doc.js
//como exepcion solo aca voy a hacer req res y responder por el router por que es un archivo local

routerPrincipal.get('/',(req, res)=>{ 
    res.status(200);
    res.json(DOC);
})


module.exports = routerPrincipal;