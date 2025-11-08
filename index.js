
const express = require('express');
const serverless = require('serverless-http');
const {PORT, HOSTNAME} = require('./src/utils/constants');

const routerPrincipal = require('./src/routers/routerPrincipal');
const routerCarrera = require('./src/routers/routerCarrera');


const app = express();
app.use(express.json());

//rutass
//raiz
app.use('/api', routerPrincipal);

//carreras
app.use('/api', routerCarrera);


//inicia server y escucha solicitudes
//3 parametros=> puerto, hostname, callback
app.listen(PORT,HOSTNAME, () =>console.log(`El servidor esta corriendo en http://${HOSTNAME}:${PORT}`));

/* -------  para el LAMBDA  ------- */
module.exports.handler = serverless(app);