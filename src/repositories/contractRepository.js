
const pool = require("../dataBase/conexionPostgres");

exports.getAllContractsRepository = async () => {
  
  try {

    const result = await pool.query(
      `SELECT
        *
        FROM
        contrato
      `
    );

    return result.rows;

  } catch (error) {

    console.error("REPOSITORY - Error al obtener contratos: " + error);
    throw Error("Error al obtener Contratos: " + error.message);

  } finally {
    //dbPool.close();
  }
};

exports.getAllNotOcuppiedContractsRepository = async () => {
  
  try {
   
    const result = await pool.query(`
      SELECT
          *
      FROM
          contrato
          where esta_ocupado = false
    `);

    return result.rows;


  } catch (error) {

    console.error("REPOSITORY - Error al obtener contratos: " + error);
    throw Error("Error al obtener Contratos: " + error.message);

  } 

};

exports.getContractsByGerenteEmailRepository = async (emailGerente) => {
  
  try {
    
    const query =  `    
      SELECT
        *
      FROM
        contrato c
      WHERE
        c.proyecto_id
          IN (
            SELECT
                id
            FROM
                proyecto p
            WHERE
                p.email_gerente = $1
          );
    `;

    const values = [emailGerente];
    
    const result = await pool.query(query, values);

    return result.rows;
    
  } catch (error) {

    console.error(
      "REPOSITORY - Error al obtener contratos por gerente: " + error
    );
    throw Error("Error al obtener Contratos: " + error.message);

  } 
};

exports.createContractRepository = async (contract) => {
  try {
    
    const query = `
        INSERT INTO
          contrato
            (tipo, titulo, descripcion, tiene_postulaciones, postulaciones, esta_ocupado, pasante_email, proyecto_id, start_date, end_date, modalidad, seniority_deseado)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::seniority_enum[])
        RETURNING id
    `;

    const values = [contract.tipo, contract.titulo, contract.descripcion ||'', contract.tiene_postulaciones,
      contract.postulaciones || '', contract.esta_ocupado,  contract.pasante_email || '',  contract.proyecto_id,
      contract.start_date || '', contract.end_date || '', contract.modalidad, contract.seniority_deseado
    ];

    const result = await pool.query(query, values);

    return result.rows[0].id; 



  } catch (error) {

    console.error("REPOSITORY - Error al crear contrato: " + error.message);
    throw Error("Error al crear contrato: " + error.message);

  } 
};

exports.updateContractRepository = async (id, contractUpdated) => {
  const {
    tipo,
    titulo,
    descripcion,
    tiene_postulaciones,
    postulaciones,
    esta_ocupado,
    pasante_email,
    proyecto_id,
    start_date,
    end_date,
    modalidad,
    seniority_deseado,
  } = contractUpdated;

  try {
    
    let setClauses = []; //guardamos los textos (ej tipo = $1)
    let values = []; //los valores que recibimos
    let paramIndex = 1; //contador que sube indicando cuantos parametros y ubicaciones actualizaremos

    if (tipo != null){
      // guardamos usando el valor del contador
      setClauses.push(`tipo = $${paramIndex}`);//$num
      
      //guardamos el valor recibido
      values.push(tipo);
      
      //subimos contador 
      paramIndex++;
    }

    if (titulo != null){
     
      setClauses.push(`titulo = $${paramIndex}`);//$num
    
      values.push(titulo);
 
      paramIndex++;
    }

    if (descripcion != null){

      setClauses.push(`descripcion = $${paramIndex}`);//$num
     
      values.push(descripcion);
   
      paramIndex++;
    }

    if (tiene_postulaciones != null){
      
      setClauses.push(`tiene_postulaciones = $${paramIndex}`);//$num
     
      values.push(tiene_postulaciones);
   
      paramIndex++;

    }

    /* Postulaciones es un falso array de strings que armamos como una especie de csv manual (email1,email2,email3) entonces al updatear este
     campo enviando un mail, ese email tiene que sumarse a la "lista". OJO: antes de habilitar este método hay que hacer algún GET que , si ya estás posultado, no te deje hacerlo (se puede hacer facilmente
    desde el componente contratos del front)
    IMPORTANTE: ESTE CAMPO TIENE QUE IR ACA ABAJO PARA NO ROMPER TODO POR EL TEMA DE LA COMA QUE METE EN EL MEDIO  */
    if (postulaciones != null) {
      // en postgres, para concatenar strings usamos ||
      // debe quedar: postulaciones = postulaciones || ',' || $5
      //setClauses.push(`postulaciones = postulaciones || ',' || $${paramIndex}`);
      // si el email esta en el texto LIKE evita duplicados
      // si es vacio o nulo, pone solo el email evita la coma inicial
      // si no, concatena la coma y el nuevo email
      setClauses.push(`
        postulaciones = CASE 
          WHEN postulaciones LIKE '%' || $${paramIndex} || '%' THEN postulaciones 
          WHEN postulaciones IS NULL OR postulaciones = '' THEN $${paramIndex} 
          ELSE postulaciones || ',' || $${paramIndex} 
        END
      `);

      values.push(postulaciones);

      paramIndex++;
    }

    if (esta_ocupado != null) {

      setClauses.push(`esta_ocupado = $${paramIndex}`);

      values.push(esta_ocupado); 

      paramIndex++;
    }

    if (pasante_email != null) {

      setClauses.push(`pasante_email = $${paramIndex}`);

      values.push(pasante_email);
      
      paramIndex++;
    }

    if (proyecto_id != null) {

      setClauses.push(`proyecto_id = $${paramIndex}`);

      values.push(proyecto_id);

      paramIndex++;
    }

    if (start_date != null) {

      setClauses.push(`start_date = $${paramIndex}`);

      values.push(start_date);

      paramIndex++;
    }

    if (end_date != null) {

      setClauses.push(`end_date = $${paramIndex}`);
      
      values.push(end_date);

      paramIndex++;
    }

    if (modalidad != null) {

      setClauses.push(`modalidad = $${paramIndex}`);

      values.push(modalidad);

      paramIndex++;
    }

    if (seniority_deseado != null) {

      setClauses.push(`seniority_deseado = $${paramIndex}::seniority_enum[]`);

      values.push(seniority_deseado);

      paramIndex++;
    }

    if (setClauses.length === 0) return null;

    // id al final para el WHERE
    values.push(id);

    // queda tipo: "UPDATE contrato SET tipo = $1, titulo = $2 "
    const query = `
      UPDATE contrato 
      SET ${setClauses.join(', ')} 
      WHERE id = $${paramIndex} 
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];

  } catch (error) {

    console.log(
      `Error en SQL REPOSITORY - updateContractRepository - ${error}`
    );

    throw error;

  } finally {
    //dbPool.close();
  }
};

exports.asignarCandidatoRepository = async (id, emailPasante) => {
  

  try {

    //Checkeo si el contrato ya esta tomado
    const checkQuery = `
      SELECT esta_ocupado 
      FROM contrato 
      WHERE id = $1
    `;

    const valuesCheck = [id];

    const resultCheck = await pool.query(checkQuery, valuesCheck);

     if (resultCheck.rows.length === 0) {
      return { notFound: true };
    }

    if (resultCheck.rows[0].esta_ocupado === true) {
      return { alreadyOccupied: true };
    }
    //Si no esta tomado continuo a actualizarlo
    const query = `
      UPDATE contrato
      SET 
        esta_ocupado = $1,
        pasante_email = $2
      WHERE id = $3
      RETURNING *;
    `;

    const values = [true, emailPasante, id];

    const result = await pool.query(query, values);

    return result.rows[0];

  } catch (error) {
    console.log(` Error en SQL REPOSITORY - asignarCandidatoRepository - ${error}`);
    throw error;
  }
};



exports.deleteContractRepository = async (id) => {

  try {

    const query = `
        DELETE
        FROM
            contrato
        WHERE
            id = $1
        RETURNING id;
    `;
    
    const values = [id];

    const result = await pool.query(query, values);

    // si borro devolvemos el id,si no null.
    return result.rows.length > 0 ? result.rows[0].id : null;

  } catch (error) {

    console.error("REPOSITORY - Error al eliminar contrato: " + error.message);
    throw Error(error.message);

  }

};
