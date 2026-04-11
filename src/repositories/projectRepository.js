const crypto = require('crypto');
const pool = require("../dataBase/conexionPostgres");

exports.chequearSiExisteProyectoConEmail = async (proyecto) => {
  
  try {
    
    const query = `
      SELECT
          EXISTS (SELECT 1 FROM proyecto WHERE email_gerente = $1);
    `;
    const values = [proyecto.email_gerente]

    const result = await pool.query(query, values);

    return result.rows[0].exists;


  } catch (error) {

    console.error(
      "REPOSITORY - Error al chequear si existen proyectos asociados a un gerente con ese email: " +
        error
    );

    throw Error( error.message);

  }
};

exports.createProyectRepository = async (project) => {
    
  try {
    let id = crypto.randomUUID();//id random con libreria incluida en node
    
    const query = `
        INSERT INTO 
        proyecto (id, nombre, description, info_link, 
        buscando_devs, id_gerente, email_gerente)
        VALUES ( $1, $2, $3, $4, $5, $6, $7 )
        RETURNING id;
    `;

    const values = [
      id, project.nombre, project.description, project.info_link,
      project.buscando_devs, project.id_gerente, project.email_gerente
    ];

    const result = await pool.query(
        query, values
    );

    return result.rows[0].id; //retornar id de ptoyecto creada

  } catch (error) {
    console.error('REPOSITORY - Error al crear proyecto: ' + error.message);
    throw Error(error.message);

  }   
}

exports.getAllProjectsRepository = async () => {
        
  try {
      

    const result = await pool.query(
        `SELECT *
          FROM   proyecto
      `
    );

    return result.rows


  } catch (error) {

    console.error('REPOSITORY - Error al obtener proyectos: ' + error);
    throw Error('Error al obtener Proyectos: ' + error.message);

  } 
}

exports.getProyectoByEmailRepository = async (email_gerente) => {

  try {

    const query = `
      SELECT
          *
      FROM
          proyecto
      WHERE
          proyecto.email_gerente = $1
    `;

    const values = [email_gerente];

    const result = await pool.query(
      query, values
    );

    return result.rows;

  } catch (error) {

    console.error(
      "REPOSITORY - Error al obtener el proyecto solicitado: " + error
    );

    throw Error(error.message);

  } 
};

exports.updateProjectRepository = async (email_gerente, projectUpdated) => {
  const {
    nombre,
    description,
    info_link,
    buscando_devs,
    contratos,
    id_gerente
  } = projectUpdated;

  
  try {

    let setClauses = []; //guardamos los textos (nombre = $1)
    let values = []; //los valores que recibimos
    let paramIndex = 1; //contador que sube indicando cuantos parametros y ubicaciones actualizaremos

    if (nombre != null) {
      // guardamos usando el valor del contador
      setClauses.push(`nombre = $${paramIndex}`); //ej: nombre = $1
      
      //guardamos el valor recibido
      values.push(nombre);// ej: "Matecito 2.0"
      
      //subimos contador 
      paramIndex++;// Ahora paramIndex vale 2
    }

    if (description != null) {
      // guardamos usando el valor del contador
      setClauses.push(`description = $${paramIndex}`);//$num
      
      //guardamos el valor recibido
      values.push(description);
      
      //subimos contador 
      paramIndex++;
    }

    if (info_link != null) {
      // guardamos usando el valor del contador
      setClauses.push(`info_link = $${paramIndex}`);//$num
      
      //guardamos el valor recibido
      values.push(info_link);
      
      //subimos contador 
      paramIndex++;
    }

    if (buscando_devs != null) {
      // guardamos usando el valor del contador
      setClauses.push(`buscando_devs = $${paramIndex}`);//$num
      
      //guardamos el valor recibido
      values.push(buscando_devs);
      
      //subimos contador 
      paramIndex++;
    }

    if (contratos != null) {
      // guardamos usando el valor del contador
      setClauses.push(`contratos = $${paramIndex}`);//$num
      
      //guardamos el valor recibido
      values.push(contratos);
      
      //subimos contador 
      paramIndex++;
    }

    if (id_gerente != null) {
      // guardamos usando el valor del contador
      setClauses.push(`id_gerente = $${paramIndex}`);//$num
      
      //guardamos el valor recibido
      values.push(id_gerente);
      
      //subimos contador 
      paramIndex++;
    }

    if (setClauses.length === 0) {
      return null; 
    }

    if (email_gerente != null) {
      //guardamos el valor recibido
      //este es un valor que usamos para encontrar el proyecto no va en clausulas
      values.push(email_gerente);
    }

    // queda tipo: "UPDATE proyecto SET nombre = $1, description = $2 "
    let query = `UPDATE proyecto SET ${setClauses.join(', ')} `;

    //el email siempre va ir al final asi que es el paraindex en posicion actual
    query += ` 
      WHERE 
       proyecto.email_gerente = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(
      query, values
    );

    return result.rows[0];

  } catch (error) {

    console.log(
     `Error en Postgres REPOSITORY - updateProjectRepository - ${error}`
    );

    throw error;

  } 
};

exports.deleteProjectRepository = async (email_gerente) => {

  try {
  
    const query = `
        DELETE
        FROM
            proyecto
        WHERE
            email_gerente = $1
        RETURNING email_gerente;
    `;

    const values = [email_gerente];//aunque sea un valor debe ir en forma de lista

    const result = await pool.query(
      query, values
    );

    return result.rows.length > 0 ? result.rows[0].email_gerente : null;


  } catch (error) {

    console.error("REPOSITORY - Error al eliminar proyecto: " + error.message);
    throw Error(error.message);

  }

};
