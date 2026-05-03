
const express = require('express');
const serverless = require('serverless-http');
const {PORT, HOSTNAME} = require('./src/utils/constants');

const routerPrincipal = require('./src/routers/routerPrincipal');
const routerCarrera = require('./src/routers/routerCarrera');
const routerCareerDev = require('./src/routers/routerCarrerDev');
const routerProyecto = require('./src/routers/routerProyecto');
const routerUsuario = require('./src/routers/routerUsuario');
const routerContrato = require('./src/routers/routerContrato');
const routerWhitelistEmail = require('./src/routers/routerWhitelistEmail');

//librerías de Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const cors = require('cors');
app.use(express.json());

// la lista desde la variable de entorno y convertirla en array
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : [];

app.use(cors({
    origin: allowedOrigins
}));

// configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Backend HunTech API',
            version: '1.0.1',
            description: 'Documentación de la API del backend de HunTech, una plataforma de conexión entre desarrolladores y proyectos tecnológicos. Esta API permite gestionar usuarios, proyectos, carreras y contratos, facilitando la interacción entre gerentes y desarrolladores junior y no tanto.',
        },
        servers: process.env.NODE_ENV !== 'development'
            ? [
                {
                    url: process.env.BACKEND_URL,
                    description: 'Servidor Producción (Vercel)'
                },
                {
                    url: `http://${HOSTNAME}:${PORT}`,
                    description: 'Servidor Local'
                }
            ]
            : [
                {
                    url: `http://${HOSTNAME}:${PORT}`,
                    description: 'Servidor Local'
                },
                {
                    url: process.env.BACKEND_URL,
                    description: 'Servidor Producción (Vercel)'
                }
            ]
    },
    // Le indicamos que busque los comentarios en todos los archivos dentro de routers
    apis: ['./src/routers/*.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

//  ruta para visualizar Swagger
// se usa customCssUrl para que la interfaz gráfica cargue bien en Vercel
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css',
    customJs: [
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-bundle.js",
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-standalone-preset.js"
    ]
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

//whitelist de emails autorizados a registrarse
app.use('/api', routerWhitelistEmail);

//inicia server y escucha solicitudes
//3 parametros=> puerto, hostname, callback
app.listen(PORT,HOSTNAME, () =>console.log(`El servidor esta corriendo en http://${HOSTNAME}:${PORT}/api`));

//exporta la app para serverless
module.exports.handler = serverless(app);//para aws
module.exports = app;//para vercel
