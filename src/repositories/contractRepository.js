
//const getPool = require("../dataBase/conexionSQL");
//const sql = require('mssql');
const pool = require("../dataBase/conexionPostgres");

exports.getAllContractsRepository = async () => {
  //let dbPool = await getPool();
  try {
    /*
    const result = await dbPool.request().query(`
            SELECT
                *
            FROM
                contrato
            `);
            
    return result.recordset;*/

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
  //let dbPool;
  try {
    /*dbPool = await getPool();
    const result = await dbPool.request().query(`
              SELECT
                  *
              FROM
                  contrato
                  where esta_ocupado = 0
              `);
    return result.recordset;*/
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

  } finally {

    /*if (dbPool) {
      dbPool.close();
    }*/

  }

};

exports.getContractsByGerenteEmailRepository = async (emailGerente) => {
  //let dbPool = await getPool();
  try {
    
    /*const result = await dbPool
      .request()
      .input("email", emailGerente) //agregue esto por que asi lo hacia gustavo y lei que es para evitar injeccion sql
      .query(`    
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
                        p.email_gerente = @email
        )
    `);
    
    return result.recordset;*/

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

  } finally {
    //dbPool.close();
  }
};

exports.createContractRepository = async (contract) => {
  try {
    /*dbPool = await getPool();
    let id = crypto.randomUUID();

    const query = `
            INSERT INTO
                dbo.contrato
                (tipo, titulo, descripcion, tiene_postulaciones, postulaciones, esta_ocupado, pasante_email, proyecto_id, start_date, end_date)
            VALUES
                (@tipo, @titulo, @descripcion, @tiene_postulaciones, @postulaciones, @esta_ocupado, @pasante_email, @proyecto_id, @start_date, @end_date)
        `;

    await dbPool
      .request()
      //.input('id', id)
      .input("tipo", contract.tipo)
      .input("titulo", contract.titulo)
      .input("descripcion", contract.descripcion || "")
      .input("tiene_postulaciones", contract.tiene_postulaciones ? 1 : 0)
      .input("postulaciones", contract.postulaciones || "")
      .input("esta_ocupado", contract.esta_ocupado ? 1 : 0)
      .input("pasante_email", contract.pasante_email || "")
      .input("proyecto_id", contract.proyecto_id)
      .input("start_date", contract.start_date || "")
      .input("end_date", contract.end_date || "")
      .query(query);
    return id;*/

    const query = `
        INSERT INTO
          contrato
            (tipo, titulo, descripcion, tiene_postulaciones, postulaciones, esta_ocupado, pasante_email, proyecto_id, start_date, end_date)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
    `;

    const values = [contract.tipo, contract.titulo, contract.descripcion ||'', contract.tiene_postulaciones,
      contract.postulaciones || '', contract.esta_ocupado,  contract.pasante_email || '',  contract.proyecto_id,
      contract.start_date || '', contract.end_date || ''
    ];

    const result = await pool.query(query, values);

    return result.rows[0].id; 



  } catch (error) {

    console.error("REPOSITORY - Error al crear contrato: " + error.message);
    throw Error("Error al crear contrato: " + error.message);

  } finally {
    //dbPool.close();
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
  } = contractUpdated;

  dbPool = await getPool();

  try {
    const requestUpdated = dbPool.request().input("id", sql.Int, id);
    if (tipo != null) requestUpdated.input("tipo", sql.VarChar, tipo);
    if (titulo != null) requestUpdated.input("titulo", sql.VarChar, titulo);
    if (descripcion != null)
      requestUpdated.input("descripcion", sql.VarChar, descripcion);
    if (tiene_postulaciones != null)
      requestUpdated.input("tiene_postulaciones", sql.Bit, tiene_postulaciones);
    /* OJO este que sigue toma uno o varios strings, los procesa y los agrega
  */  
    if (postulaciones != null) {
      let newPostulaciones = ","+postulaciones
      //const postulacionesStr = Array.isArray(postulaciones) ? postulaciones.join(',') : postulaciones;
      requestUpdated.input("postulaciones", sql.VarChar, newPostulaciones)
    }
      
    if (esta_ocupado != null)
      requestUpdated.input("esta_ocupado", sql.Bit, esta_ocupado);
    if (pasante_email != null)
      requestUpdated.input("pasante_email", sql.VarChar, pasante_email);
    if (proyecto_id != null)
      requestUpdated.input("proyecto_id", sql.VarChar, proyecto_id);
    if (start_date != null)
      requestUpdated.input("start_date", sql.VarChar, start_date);
    if (end_date != null)
      requestUpdated.input("end_date", sql.VarChar, end_date);

let queryActualizada = "UPDATE contrato SET ";
    if (tipo != null) queryActualizada += "tipo = @tipo, ";
    if (titulo != null) queryActualizada += "titulo = @titulo, ";
    if (descripcion != null) queryActualizada += "descripcion = @descripcion, ";
    /* esta debería ser semi automática: la primera vez que alguien se postula, pasaría a 1, y luego ya queda así */
    if (tiene_postulaciones != null)
      queryActualizada += "tiene_postulaciones = @tiene_postulaciones, ";
      /* Postulaciones es un falso array de strings que armamos como una especie de csv manual (email1,email2,email3) entonces al updatear este
     campo enviando un mail, ese email tiene que sumarse a la "lista". OJO: antes de habilitar este método hay que hacer algún GET que , si ya estás posultado, no te deje hacerlo (se puede hacer facilmente
    desde el componente contratos del front)
    IMPORTANTE: ESTE CAMPO TIENE QUE IR ACA ABAJO PARA NO ROMPER TODO POR EL TEMA DE LA COMA QUE METE EN EL MEDIO  */  
    
    if (postulaciones != null) {
      queryActualizada +=
    `postulaciones += @postulaciones`;
    }
      
    /* estas dos que siguen deberían usarse una sola vez */
    if (esta_ocupado != null)
      queryActualizada += "esta_ocupado = @esta_ocupado, ";
    if (pasante_email != null)
      queryActualizada += "pasante_email = @pasante_email, ";
    /* esta no debería usarse nunca: */
    if (proyecto_id != null) queryActualizada += "proyecto_id = @proyecto_id, ";
    if (start_date != null) queryActualizada += "start_date = @start_date, ";
    if (end_date != null) queryActualizada += "end_date = @end_date, ";
  

    /* esto que sigue borra espacios al principio y al final (trim) y luego elimina comas al final ($ aquí significa al final). */
    queryActualizada = queryActualizada.trim().replace(/,$/, "");
    queryActualizada += " OUTPUT INSERTED.* WHERE id = @id";

    //console.log(requestUpdated)
    //console.log(queryActualizada)
    
    let contratoActualizado = await requestUpdated.query(queryActualizada);
        
    return contratoActualizado.recordset[0];

    return updatedFields;
    //console.log("Results object:", results);  DA UNDEFINED Y NO SE PUEDE ARREGLAR A ESTA ALTURA CREO QUE ES ALGO DE AWS.
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
  //dbPool = await getPool();

  try {
    //Checkeo si el contrato ya esta tomado
   /* const checkRequest = dbPool.request()
      .input("id", sql.Int, id);

    const checkQuery = `
      SELECT esta_ocupado 
      FROM contrato 
      WHERE id = @id
    `;

    const checkResult = await checkRequest.query(checkQuery);

    if (checkResult.recordset.length === 0) {
      return { notFound: true };
    }

    if (checkResult.recordset[0].esta_ocupado === true) {
      return { alreadyOccupied: true };
    }
    //Si no esta tomado continuo a actualizarlo
    const request = dbPool.request()
      .input("id", sql.Int, id)
      .input("esta_ocupado", sql.Bit, 1)
      .input("pasante_email", sql.VarChar, emailPasante);

    const query = `
      UPDATE contrato
      SET 
        esta_ocupado = @esta_ocupado,
        pasante_email = @pasante_email
      OUTPUT INSERTED.*
      WHERE id = @id
    `;

    const result = await request.query(query);
    return result.recordset[0];*/
    //Checkeo si el contrato ya esta tomado
    const checkQuery = `
      SELECT esta_ocupado 
      FROM contrato 
      WHERE id = $1
    `;

    const valuesCheck = [];

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

  //let dbPool = await getPool();

  try {
    /*const query = `
            DELETE
            FROM
                contrato
            WHERE
                id = @id
        `;
    await dbPool.request().input("id",  sql.Int, id).query(query);
    
    return id;*/

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

  }finally {
   // dbPool.close();
  } 

};