/* Este flujo va a ser un poco diferente porque no se va a trabajar con ninguna tabla Usuarios
ni se va a crear nada llamado usuarios. Pero en términos conceptuales (o en POO), tenemos 3 subtipos de usuarios:
desarrolladores, gerentes, e instituciones educativas. la idea es que este flujo se encargue del CRUD de los 3 */

const getPool = require("../dataBase/conexionSQL");
const sql = require('mssql');
const crypto = require('crypto');
const { TABLAS_PERMITIDAS } = require("../utils/constants");

/* ############# USUARIOS EN GENERAL ############# */

exports.chequearSiExisteUsuarioConEmail = async (usuario) => {
  let dbPool = await getPool();
  try {
    //console.log('REPOSITORIO usuario: ', usuario)
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

    throw Error(error.message);
  }

  finally {

    dbPool.close(); // cerrar conexion al terminar la operacion

  }
};

//este devuelve tambien el nombre de la tabla en que encontro el email
exports.chequearSiExisteUsuarioConEmailRetornarNombreTabla = async (email) => {
  let dbPool = await getPool();

  try {

    const query = `
            SELECT TOP 1 'gerente' AS tabla FROM gerente WHERE email = @email
            UNION ALL
            SELECT TOP 1 'desarrollador' AS tabla FROM desarrollador WHERE email = @email
            UNION ALL
            SELECT TOP 1 'institucion_educativa' AS tabla FROM institucion_educativa WHERE email = @email
            ;
        `;

    const result = await dbPool
      .request()
      .input("email", email)
      .query(query);

    //recosrset array objetos 
    if (result.recordset.length > 0) {
      // si hay coincidencia recordset[0].tabla tendra el nombre de la primera tabla donde lo ubico al email
      return { existe: 1, tabla: result.recordset[0].tabla };
    } else {
      // si no se encontro en ninguna tabla
      return { existe: 0, tabla: null };
    }

  } catch (error) {
    console.error(
      "REPOSITORY - Error al chequear si existen usuarios con ese email: " +
      error
    );
    throw new Error(
      "Error al chequear si existen usuarios con ese email " + error.message
    );
  } finally {

    dbPool.close(); // cerrar conexion al terminar la operacion

  }

};

//actualiza cualquier tipo de usuario por email y retorna todo el objeto actualizado
exports.updateUsuarioByEmailRepository = async (email, usuario) => {

  let dbPool = await getPool();

  //el front ya sabe el tipo de usuario así que lo puede mandar desde el form
  try {

    //si el usuario fuera gerente:
    if (usuario.rol == "gerente") {

      //toma los datos del gerente que vinieron desde el body de la req en el controller
      let { id_gerente, id_proyecto, nombre, email, descripcion } = usuario;

      //crea un dbpool request con el mail que vino desde el controller por parámetro
      let request = dbPool.request().input('email', sql.VarChar, email);

      //solo agrega input para las propiedades enviadas
      if (nombre != null) { request.input('nombre', sql.VarChar, nombre); }
      if (descripcion != null) { request.input('descripcion', sql.VarChar, descripcion); }
      if ( id_gerente != null) { request.input('id_gerente', sql.VarChar, id_gerente); }
      if ( id_proyecto != null) { request.input('id_proyecto', sql.VarChar, id_proyecto); }

      //crea la query
      let query = `UPDATE dbo.gerente SET `;
      //solo modifica campos correspondientes a las propiedades enviadas
      if (nombre != null) { query += `nombre = @nombre, `; }
      if (descripcion != null) { query += `descripcion = @descripcion, `; }
      if (id_gerente != null) { query += `id_gerente = @id_gerente, `; }
      if (id_proyecto != null) { query += `id_proyecto = @id_proyecto, `; }

      //limpia comas sobrantes y espacios en blanco
      query = query.trim().replace(/,$/, "")
      //retorna las columnas que hayan sido modificadas
      query += ' OUTPUT INSERTED.* ';
      //usando el email recibido desde el controller por parámetro
      query += ' WHERE email = @email'

      let result = await request.query(query);
      //retorna al servicio un objeto con estos campos. 
      return result.recordset[0];

    } else {
      //si el usuario fuera desarro
      // llador... igual que gerente.
      if (usuario.rol == "desarrollador") {

        let { nombre, descripcion, skills } = usuario;

        let request = dbPool.request().input('email', sql.VarChar, email);

        if (nombre != null) { request.input('nombre', sql.VarChar, nombre); }
        if (descripcion != null) { request.input('descripcion', sql.VarChar, descripcion); }

        let query = `UPDATE dbo.desarrollador SET `;
        if (nombre != null) { query += `nombre = @nombre, `; }

        if (skills != null) {
          const skillsStr = Array.isArray(skills) ? skills.join(',') : skills;
          request.input('skills', sql.VarChar, skillsStr);
          query += `skills = @skills, `;
        }

        if (descripcion != null) { query += `descripcion = @descripcion, `; }

        query = query.trim().replace(/,$/, "")
        query += ' OUTPUT INSERTED.* ';
        query += ' WHERE email = @email'

        let result = await request.query(query);
        
        return result.recordset[0];

      } else {
        if (usuario.rol == "institucion_educativa") {
          //a desarrollar más adelante
          return [{"estado" : "a desarrollar"}]
        }
      }
    }

  } catch (error) {

    console.error("REPOSITORY - Error al actualizar usuario: " + error.message);
    throw Error("Error al actualizar usuario: " + error.message);

  } finally {

    dbPool.close();

  }
};




/* ############# GERENTES ############# */

exports.getAllGerentesRepository = async () => {
  let dbPool = await getPool();

  try {

    const result = await dbPool.request().query(`
            SELECT
                *
            FROM
                gerente
            `);
    return result.recordset;

  } catch (error) {

    console.error("REPOSITORY - Error al obtener gerentes: " + error);
    throw Error(error.message);

  } finally {

    dbPool.close(); // cerrar conexion al terminar la operacion

  }
};

exports.getGerenteByEmailRepository = async (gerente) => {

  let dbPool = await getPool();

  try {

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
      .input("email", sql.VarChar, gerente.email)
      .query(query);
    return result.recordset;
  } catch (error) {

    console.error(
      "REPOSITORY - Error al obtener el gerente solicitado: " + error
    );
    throw Error(error.message);

  } finally {

    dbPool.close(); // cerrar conexion al terminar la operacion

  }
};

exports.createGerenteRepository = async (gerente) => {
  dbPool = await getPool();

  try {

    const query = `
            INSERT INTO
                dbo.gerente
                (email, id_gerente, id_proyecto, nombre, descripcion)
            VALUES
                (@email, @id_gerente, @id_proyecto, @nombre, @descripcion)
        `;
    await dbPool
      .request()
      .input("email", sql.VarChar, gerente.email)
      .input("id_gerente", sql.VarChar, gerente.id_gerente || "")
      .input("id_proyecto", sql.VarChar, gerente.id_proyecto || "")
      .input("nombre", sql.VarChar, gerente.nombre || "")
      .input("descripcion", sql.VarChar, gerente.descripcion || "")
      .query(query);

    return gerente.email;

  } catch (error) {

    console.error("REPOSITORY - Error al crear gerente: " + error.message);
    throw Error(error.message);

  } finally {

    dbPool.close(); // cerrar conexion al terminar la operacion

  }
};

exports.deleteGerenteRepository = async (gerente) => {

  let dbPool = await getPool();

  try {
    const query = `
            DELETE
            FROM
                gerente
            WHERE
                gerente.email = @email
        `;
    await dbPool.request().input("email", sql.VarChar, gerente.email).query(query);

    return gerente.email;
  } catch (error) {

    console.error("REPOSITORY - Error al eliminar gerente: " + error.message);
    throw Error(error.message);

  } finally {

    dbPool.close(); // cerrar conexion al terminar la operacion

  }

};

/* ############# DESARROLLADORES ############# */

exports.getAllDesarrolladoresRepository = async () => {
  let dbPool = await getPool();

  try {
    const result = await dbPool.request().query(`
            SELECT
                *
            FROM
                desarrollador
            `);
    return result.recordset;

  } catch (error) {
    console.error("REPOSITORY - Error al obtener desarrolladores: " + error);
    throw Error(error.message);
  } finally {
    dbPool.close(); // cerrar conexion al terminar la operacion
  }
};

exports.getDesarrolladorByEmailRepository = async (desarrollador) => {

  let dbPool = await getPool();
  try {
    const query = `
            SELECT
                *
            FROM
                desarrollador
            WHERE
                desarrollador.email = @email
            `;
    const result = await dbPool
      .request()
      .input("email", sql.VarChar, desarrollador.email)
      .query(query);
    return result.recordset;
  } catch (error) {

    console.error(
      "REPOSITORY - Error al obtener el desarrollador solicitado: " + error
    );
    throw Error(error.message);

  } finally {

    dbPool.close(); // cerrar conexion al terminar la operacion

  }
};


exports.createDesarrolladorRepository = async (desarrollador) => {
  let dbPool = await getPool();

  try {

    let id = crypto.randomUUID();//id random con libreria incluida een node
    const query = `
            INSERT INTO
                dbo.desarrollador
                (email, id, nombre, descripcion)
            VALUES
                (@email, @id, @nombre, @descripcion)
        `;
    await dbPool
      .request()
      .input("email", sql.VarChar, desarrollador.email)
      .input("id", sql.VarChar, id)
      .input("nombre", sql.VarChar, desarrollador.nombre || "")
      .input("apellido", sql.VarChar, desarrollador.apellido || "")
      .input("descripcion", sql.VarChar, desarrollador.descripcion || "")
      .input("fecha_nacimiento", sql.VarChar, desarrollador.fecha_nacimiento || "")
      .query(query);

    return desarrollador.email;

  } catch (error) {

    console.error("REPOSITORY - Error al crear desarrollador: " + error.message);
    throw Error("Error al crear desarrollador: " + error.message);

  } finally {

    dbPool.close(); // cerrar conexion al terminar la operacion

  }
};

exports.deleteDesarrolladorRepository = async (desarrollador) => {
  let dbPool = await getPool();
  try {
    const query = `
            DELETE
            FROM
                desarrollador
            WHERE
                desarrollador.email = @email
        `;
    await dbPool.request().input("email", sql.VarChar, desarrollador.email).query(query);

    return desarrollador.email;
  } catch (error) {
    console.error("REPOSITORY - Error al eliminar desarrollador: " + error.message);
    throw Error(error.message);
  } finally {
    dbPool.close(); // cerrar conexion al terminar la operacion
  }
};

//actualiza desarrollador por email y retorna todo el objeto actualizado
/* MÉTODO DEPRECADO AHORA RUTIAMOS TODOS LOS PUT DE USUARIO POR EL MÉTODO GENÉRICO DE USUARIO */
exports.updateDesarrolladorByEmailRepository = async (email, desarrollador) => {
  let dbPool = await getPool();

  try {
    let { nombre, descripcion, skills } = desarrollador;

    let request = dbPool.request().input('email', sql.VarChar, email);

    if (nombre != null) { request.input('nombre', sql.VarChar, nombre); }
    if (descripcion != null) { request.input('descripcion', sql.VarChar, descripcion); }

    let query = `UPDATE dbo.desarrollador SET `;
    if (nombre != null) { query += `nombre = @nombre, `; }

    if (skills != null) {
      const skillsStr = Array.isArray(skills) ? skills.join(',') : skills;
      request.input('skills', sql.VarChar, skillsStr);
      query += `skills = @skills, `;
    }

    if (descripcion != null) { query += `descripcion = @descripcion, `; }

    query = query.trim().replace(/,$/, "")
    query += ' OUTPUT INSERTED.* ';
    query += ' WHERE email = @email'


    let result = await request.query(query);

    /*let updatedFields= [];

    for (let name in request.parameters)
    {
        if (name != "id")updatedFields.push(name)
    };*/

    //return updatedFields; //ahora devuelve los campos que se actualizaron

    return result.recordset[0];

  } catch (error) {

    console.error("REPOSITORY - Error al actualiza desarrollador: " + error.message);
    throw Error("Error al actualizar desarrollador: " + error.message);

  } finally {

    dbPool.close();

  }
};

//objeto usuario con email y nombre de la tabla
exports.getUserByEmailRepository = async (email, tabla) => {
  let dbPool = await getPool();

  try {

    if (!TABLAS_PERMITIDAS.includes(tabla)) {
      throw Error('Tabla no permitida');
    }

    const query = `
            SELECT
                *
            FROM
                ${tabla}
            WHERE
              ${tabla}.email = @email
            `;
    const result = await dbPool
      .request()
      .input("email", sql.VarChar, email)
      .query(query);

    return result.recordset[0];

  } catch (error) {

    console.error(
      "REPOSITORY - Error al obtener el usuario solicitado: " + error
    );

    throw Error(error.message);

  } finally {

    dbPool.close();

  }
};
