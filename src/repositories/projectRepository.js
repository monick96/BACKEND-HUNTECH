const { info } = require("console");
const getPool = require("../dataBase/conexionSQL");
const crypto = require('crypto');
const sql = require("mssql");

//CAPA REPOSITORY : metodos de CRUD a la DB
//usamos return para enviar resultado a service y 
// throw error para propagar el error y que lo tome el service,
// y finalmente lo retorne controller

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
    
    let queryActualizada = "UPDATE proyecto SET ";
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
    console.log(queryActualizada)

    const proyectoActualizado = await requestUpdated.query(queryActualizada);
    
    console.log(proyectoActualizado)

    if (proyectoActualizado.rowsAffected[0] == 0) {
            return null
        } else {
            return { nombre, description, info_link, buscando_devs, contratos, id_gerente }
        }
  } catch (error) {
    console.log(
      `Error en SQL REPOSITORY - updateProjectRepository - ${error}`
    );
    throw error;
  } finally {
    //dbPool.close();
  }
};