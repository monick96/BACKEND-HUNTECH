const DOC = {
    mensaje: {
      saludo: 'Hola Somos el GRUPO 6, este es nuestro Back end con Express CONECTADO A SQL SERVER',
      integrantes: [
        "Melgarejo Mónica",
        "Nadine Nahuel Celeste",
        "Ariel Wasserman"
      ]
    },
    uso: 'RUTAS HASTA EL MOMENTO',
    endpoints: {
      RAIZ : 'api/ -> la raiz con la documentación',
      GET: [
            'api/proyectos -> lista todas las proyectos',
            'api/contratos -> lista todos los contratos',
            'api/contratos_by_emailgerente -> body: {"emailGerente": "pepito@gmail.com"}',
            'api/carreras -> lista todas las carreras',
            'api/carreras_desarrollador -> lista todas las carreras por desarrollador'
          ],
      POST: [
            'api/proyecto -> crea nuevo proyecto (body: nombre(obligatorio), description(obligatorio, true o false), info_link(opcional),buscando_devs(obligatorio),id_gerente(obligatorio), email_gerente(obligatorio))',
            `api/contrato -> crea un nuevo contrato (tipo: string, titulo: string, descripcion: string, tiene_postulaciones: bool 1 o 0,
              postulaciones: string, -- lista de emails separados por coma, esta_ocupado: booleano 1 o 0, pasante_email:string,
              projecto_id: string, start_date string, end_date string`,
            'api/carrera -> crea una nueva carrera (nombre: string, info_link: string, status: string, id_institucion_educativa: string)',
            'api/carrera_desarrollador -> crea una nueva carrera por desarrollador (id_desarrollador: string, id_carrera: string, start_date: string, end_date: string, isvalidated: boolean)'
      ]
    },
    ejemploPostProyecto: {
      POST: 'api/proyecto',
      body: {
        nombre: "Matecito 2.0",
        description: "Aplicación web y móvil para venta de mates y accesorios.",
        info_link: "https://www.matecito.com",
        buscando_devs: true,
        id_gerente:"5",
        email_gerente: "pepito@gmail.com"
      },
      respuestaExito:{ 
        message: "Proyecto creado", 
        proyectId: "10486a57-9717-4903-b402-199356b7ce7b" 
      }
    },
  ejemploPostCarrera: {
  POST: 'api/carrera',
  body: {
    nombre: "Ingeniería en Software",
    info_link: "https://www.universidadtecnologica.edu.ar/carreras/ingenieria-software",
    id_institucion_educativa: "UTN123",
    status: "activo"
  },
  respuestaExito: { 
    message: "Carrera creada", 
    careerId: "7f2a9b1c-39f0-4a32-9d91-63d7f98bde52"
  }
},
ejemploPostCareerDev: {
  POST: 'api/carreras_desarrollador',
  body: {
    id_desarrollador: "DEV01",
    id_carrera: "CARRERA100",
    start_date: "05-03-2025",
    end_date: "09-11-2029",
    isvalidated: true
  },
  respuestaExito: { 
    message: "Carrera por desarrollador creada", 
    careerDevId: "a1b2c3d4-5678"
  }
},

    ejemploPostContrato: {
      POST: 'api/contrato',
      body: {
          "tipo": "WEB",
          "titulo": "Desarrrollador web para matecito Argentina estapa 2",
          "descripcion": "bucamos expandir el negocio a la venta web en una pagina propia",
          "tiene_postulaciones": false,
          //postulaciones: <- un array de strings. pero si le pongo false no le pongo postulaciones viste?
          "esta_ocupado": false, //cuando este pase a true es xq se contrató a alguien
          // pasante_email <- este se llena si esta_ocupado es true
          "proyecto_id": "6d76cf92-ba74-436a-a143-6b7e710bfc1c" 
          /*"start_date"
          "end_date"  ninguno de estos datos es obligatorio. pero si lo fuera ES STRING */
      },
      respuestaExito:{ 
        "message": "contrato creado",
        "contractId": "cef72fac-a024-43d7-bc9d-995192079d00" 
      }
    },
    notas: [
        "Recordar poner las comillas a los nombres de las propiedades.",
        "Todavía no existe validación de roles, así que en gerente_id puede ir cualquier string."
    ]
  }


module.exports = DOC;