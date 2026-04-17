const express = require('express');
const routerPrincipal = express.Router();

// Ruta que apunta a la raíz del proyecto (/api) y redirige a la documentación
//ahora en swagger
routerPrincipal.get('/', (req, res) => { 
    // Redirige al usuario a la interfaz de Swagger
    res.redirect('/api/docs');
});

module.exports = routerPrincipal;