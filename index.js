
const express = require('express');
const {PORT, HOSTNAME} = require('./src/utils/constants');

const routerPrincipal = require('./src/routers/routerPrincipal');
const routerCarrera = require('./src/routers/routerCarrera');
const routerInstitucion = require('./src/routers/routerInstitucion');
const routerCareerDev = require('./src/routers/routerCarrerDev');
const routerProyecto = require('./src/routers/routerProyecto');

const app = express();
app.use(express.json());

//rutass
//raiz
app.use('/api', routerPrincipal);

//carreras
app.use('/api', routerCarrera);

//instituciones 
app.use('/api', routerInstitucion);

//carreras por desarrollador
app.use('/api', routerCareerDev);

//proyectos(todos los paths)
app.use('/api', routerProyecto);

//inicia server y escucha solicitudes
//3 parametros=> puerto, hostname, callback
app.listen(PORT,HOSTNAME, () =>console.log(`El servidor esta corriendo en http://${HOSTNAME}:${PORT}/api`));
