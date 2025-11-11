const { info } = require("console");
const getPool = require("../dataBase/conexionSQL");
const crypto = require('crypto');
const sql = require("mssql");

exports.chequearSiExisteProyectoConEmail = async (proyecto) => {
  let dbPool = await getPool();
  try {
    //console.log('REPOSITORIO proyecto: ', proyecto)
    const query = `
            SELECT CASE
            WHEN
                EXISTS (SELECT 1 FROM proyecto WHERE email_gerente = @email_gerente)
            THEN 1 ELSE 0 END AS existe
            ;
        `;
    const result = await dbPool
      .request()
      .input("email_gerente", proyecto.email_gerente)
      .query(query);
    return result.recordset[0].existe;
  } catch (error) {
    console.error(
      "REPOSITORY - Error al chequear si existen proyectos asociados a un gerente con ese email: " +
        error
    );

    throw Error( error.message);}
    
  finally {
        
    dbPool.close();

  } 
};

exports.createProyectRepository = async (project) => {
    dbPool = await getPool();
    try {
        let id = crypto.randomUUID();//id random con libreria incluida en node
        const query = `
            INSERT INTO 
            proyecto (id, nombre, description, info_link, 
            buscando_devs, id_gerente, email_gerente)
            VALUES (
                @id, 
                @nombre, 
                @description, 
                @info_link, 
                @buscando_devs, 
                @id_gerente,
                @email_gerente
            )
        `;

        //.input()	asigna valores a parámetros SQL(@id, @nombre, etc)
        //evita injeccion SQL al evitar concatenar strings
        //.query()	ejecuta el INSERT
        await dbPool.request()
            .input('id', id)
            .input('nombre', project.nombre)
            .input('description', project.description)
            .input('info_link', project.info_link || '')
            //valor debe ser uno o 0( lo dejamos un repository por que no fue un requisito del "cliente")
            //no es parte del negocio
            .input('buscando_devs', project.buscando_devs ? 1 : 0)
            .input('id_gerente', project.id_gerente || '')
            .input('email_gerente', project.email_gerente)
            .query(query);
        return id;
        
    } catch (error) {
        console.error('REPOSITORY - Error al crear proyecto: ' + error.message);
        throw Error(error.message);

    } finally {  

        dbPool.close(); // cerrar conexion al terminar la operacion

    } 
    
}

exports.getAllProjectsRepository = async () => {
        //dos metodos async: esperar al get pool y a la  respuesta de la query
        let dbPool = await getPool();
    try {
        //las querys deberian ir en sqlQuery
        const result = await dbPool.request().query(
            `SELECT *
        FROM   proyecto
        `
        );
        console.log(result.recordset)
        return result.recordset;

    } catch (error) {
        console.error('REPOSITORY - Error al obtener proyectos: ' + error);
        throw Error('Error al obtener Proyectos: ' + error.message);
    } finally {
        dbPool.close(); // cerrar conexion al terminar la operacion
    } 
}

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
    dbPool = await getPool();
    const requestUpdated = dbPool.request().input("email_gerente", sql.VarChar, email_gerente);

    if (nombre != null) requestUpdated.input("nombre", sql.VarChar, nombre);
    if (description != null) requestUpdated.input("description", sql.VarChar, description);
    if (info_link != null) requestUpdated.input("info_link", sql.VarChar, info_link);
    if (buscando_devs != null) requestUpdated.input("buscando_devs", sql.Bit, buscando_devs);
    if (contratos != null) requestUpdated.input("contratos", sql.VarChar, contratos);
    if (id_gerente != null) requestUpdated.input("id_gerente", sql.VarChar, id_gerente);
    //if (email_gerente != null) requestUpdated.input("email_gerente", sql.VarChar, email_gerente);
    
    let queryActualizada = "UPDATE dbo.proyecto SET ";
    if (nombre != null) queryActualizada += "nombre = @nombre, ";
    if (description != null) queryActualizada += "description = @description, ";
    if (info_link != null) queryActualizada += "info_link = @info_link, ";
    if (buscando_devs != null) queryActualizada += "buscando_devs = @buscando_devs, ";
    if (contratos != null) queryActualizada += "contratos = @contratos, ";
    if (id_gerente != null) queryActualizada += "id_gerente = @id_gerente, ";
    //if (email_gerente != null) queryActualizada += "email_gerente = @email_gerente, ";
    
    /* esto que sigue borra espacios al principio y al final (trim) y luego elimina comas al final ($ aquí significa al final). */
    queryActualizada = queryActualizada.trim().replace(/,$/, "");
    queryActualizada += " OUTPUT INSERTED.* WHERE email_gerente = @email_gerente";
    
    //console.log(requestUpdated)
    //console.log(queryActualizada)

    let proyectoActualizado = await requestUpdated.query(queryActualizada);
    
    console.log(proyectoActualizado)
    return proyectoActualizado.recordset[0];

  } catch (error) {
    console.log(
     `Error en SQL REPOSITORY - updateProjectRepository - ${error}`
    );
    throw error;
  } finally {
    //dbPool.close();
  }
};

exports.deleteProjectRepository = async (email_gerente) => {

  let dbPool = await getPool();

  try {
    const query = `
            DELETE
            FROM
                proyecto
            WHERE
                email_gerente = @email_gerente
        `;
    await dbPool.request().input("email_gerente",  sql.VarChar, email_gerente).query(query);

    return email_gerente;
  } catch (error) {

    console.error("REPOSITORY - Error al eliminar proyecto: " + error.message);
    throw Error(error.message);

  }finally {
    dbPool.close();
  } 

};
