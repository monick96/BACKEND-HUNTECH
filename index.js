
const express = require('express');
const {PORT, HOSTNAME} = require('./src/utils/constants');

const routerPrincipal = require('./src/routers/routerPrincipal');
const routerCarrera = require('./src/routers/routerCarrera');
const routerCareerDev = require('./src/routers/routerCarrerDev');
const routerProyecto = require('./src/routers/routerProyecto');
const routerUsuario = require('./src/routers/routerUsuario');
const routerContrato = require('./src/routers/routerContrato');

const app = express();
const cors = require('cors');
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:4200' 
}));

//rutass
//raiz
app.use('/api', routerPrincipal);

//carreras
app.use('/api', routerCarrera);

//carreras por desarrollador
app.use('/api', routerCareerDev);

//proyectos(todos los paths)
app.use('/api', routerProyecto);

//ruta contrato 
app.use('/api', routerContrato);

//usuarios (todos los paths: atención esta ruta manejará gerentes y desarrolladores)
app.use('/api', routerUsuario)

//inicia server y escucha solicitudes
//3 parametros=> puerto, hostname, callback
app.listen(PORT,HOSTNAME, () =>console.log(`El servidor esta corriendo en http://${HOSTNAME}:${PORT}/api`));
