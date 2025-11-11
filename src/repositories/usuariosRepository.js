/* Este flujo va a ser un poco diferente porque no se va a trabajar con ninguna tabla Usuarios
ni se va a crear nada llamado usuarios. Pero en términos conceptuales (o en POO), tenemos 3 subtipos de usuarios:
desarrolladores, gerentes, e instituciones educativas. la idea es que este flujo se encargue del CRUD de los 3 */

const getPool = require("../dataBase/conexionSQL");

/* ############# USUARIOS ############# */

exports.chequearSiExisteUsuarioConEmail = async (usuario) => {
  try {
    //console.log('REPOSITORIO usuario: ', usuario)
    let dbPool = await getPool();
    const query = `
            SELECT CASE
            WHEN
                EXISTS (SELECT 1 FROM gerente WHERE email = @email)
            OR
                EXISTS (SELECT 1 FROM desarrollador WHERE email = @email)
            OR
                EXISTS (SELECT 1 FROM institucion_educativa WHERE email = @email)
            THEN 1 ELSE 0 END AS existe
            ;
        `;
    const result = await dbPool
      .request()
      .input("email", usuario.email)
      .query(query);
    return result.recordset[0].existe;
  } catch (error) {
    console.error(
      "REPOSITORY - Error al chequear si existen usuarios con ese email: " +
        error
    );
    throw Error(
      "Error al chequear si existen usuarios con ese email " + error.message
    );
  }
};

/* ############# GERENTES ############# */

exports.getAllGerentesRepository = async () => {
  try {
    let dbPool = await getPool();
    const result = await dbPool.request().query(`
            SELECT
                *
            FROM
                gerente
            `);
    return result.recordset;
  } catch (error) {
    console.error("REPOSITORY - Error al obtener gerentes: " + error);
    throw Error("Error al obtener Gerentes: " + error.message);
  }
};

exports.getGerenteByEmailRepository = async (gerente) => {
  try {
    let dbPool = await getPool();
    const query = `
            SELECT
                *
            FROM
                gerente
            WHERE
                gerente.email = @email
            `;
    const result = await dbPool
      .request()
      .input("email", gerente.email)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error(
      "REPOSITORY - Error al obtener el gerente solicitado: " + error
    );
    throw Error("Error al obtener el gerente solicitado: " + error.message);
  }
};

exports.createGerenteRepository = async (gerente) => {
  try {
    dbPool = await getPool();
    const query = `
            INSERT INTO
                dbo.gerente
                (email, id_gerente, id_proyecto, nombre, descripcion)
            VALUES
                (@email, @id_gerente, @id_proyecto, @nombre, @descripcion)
        `;
    await dbPool
      .request()
      .input("email", gerente.email)
      .input("id_gerente", gerente.id_gerente || "")
      .input("id_proyecto", gerente.id_proyecto || "")
      .input("nombre", gerente.nombre || "")
      .input("descripcion", gerente.descripcion || "")
      .query(query);
    return gerente.email;
  } catch (error) {
    console.error("REPOSITORY - Error al crear gerente: " + error.message);
    throw Error("Error al crear gerente: " + error.message);
  }
};

exports.deleteGerenteRepository = async (gerente) => {
  try {
    dbPool = await getPool();

    const query = `
            DELETE
            FROM
                gerente
            WHERE
                gerente.email = @email
        `;
    await dbPool.request().input("email", gerente.email).query(query);

    return gerente.email;
  } catch (error) {
    console.error("REPOSITORY - Error al eliminar gerente: " + error.message);
    throw Error("Error al eliminar gerente: " + error.message);
  }
};