/* Este flujo va a ser un poco diferente porque no se va a trabajar con ninguna tabla Usuarios
ni se va a crear nada llamado usuarios. Pero en términos conceptuales (o en POO), tenemos 3 subtipos de usuarios:
desarrolladores, gerentes, e instituciones educativas. la idea es que este flujo se encargue del CRUD de los 3 */

const pool = require("../dataBase/conexionPostgres");
const crypto = require('crypto');//lo dejo por ahora pero se supone que deberia recibir ids desde el auth
const { TABLAS_PERMITIDAS } = require("../utils/constants");

/* ############# USUARIOS EN GENERAL ############# */

exports.chequearSiExisteUsuarioConEmail = async (usuario) => {
 
  try {

    const query = `
        SELECT 
            EXISTS (SELECT 1 FROM gerente WHERE email = $1) OR
            EXISTS (SELECT 1 FROM desarrollador WHERE email = $1) OR
            EXISTS (SELECT 1 FROM institucion_educativa WHERE email = $1) 
        AS existe;
    `;

    const values = [usuario.email];

    const result = await pool.query(query, values);

    return result.rows[0].existe;

  } catch (error) {
    
    console.error(
      "REPOSITORY - Error al chequear si existen usuarios con ese email: " +
      error
    );

    throw Error(error.message);
  }
};

//este devuelve tambien el nombre de la tabla en que encontro el email
exports.chequearSiExisteUsuarioConEmailRetornarNombreTabla = async (email) => {
 
  try {

    // en usamos LIMIT 1 en lugar de TOP 1
    const query = `
        SELECT 'gerente' AS tabla FROM gerente WHERE email = $1
        UNION ALL
        SELECT 'desarrollador' AS tabla FROM desarrollador WHERE email = $1
        UNION ALL
        SELECT 'institucion_educativa' AS tabla FROM institucion_educativa WHERE email = $1 
        LIMIT 1;
    `;

    const result = await pool.query(query, [email]);

    if (result.rows.length > 0) {
      return { existe: 1, tabla: result.rows[0].tabla };
    } else {
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

  } 

};

//actualiza cualquier tipo de usuario por email y retorna todo el objeto actualizado
exports.updateUsuarioByEmailRepository = async (email, usuario) => {

  //el front ya sabe el tipo de usuario así que lo puede mandar desde el form
  try {

    let setClauses = [];
    let values = [];
    let paramIndex = 1;

    if (!usuario.rol) {
      throw new Error("El campo 'rol' es obligatorio para saber qué tabla actualizar.");
    }

    //las tablas se llaman igual que los roles permitidos
    if (!TABLAS_PERMITIDAS.includes(usuario.rol)) {
      throw new Error("Rol inválido.");
    }

    // GERENTE
    if (usuario.rol === "gerente") {

      const { id_gerente, id_proyecto, nombre, descripcion } = usuario;

      if (nombre != null) { 

        setClauses.push(`nombre = $${paramIndex}`); 

        values.push(nombre); 

        paramIndex++; 
      }

      if (descripcion != null) { 

        setClauses.push(`descripcion = $${paramIndex}`); 

        values.push(descripcion); 

        paramIndex++; 
      }

      if (id_gerente != null) { 

        setClauses.push(`id_gerente = $${paramIndex}`); 

        values.push(id_gerente);

        paramIndex++; 
      }

      if (id_proyecto != null) { 

        setClauses.push(`id_proyecto = $${paramIndex}`); 

        values.push(id_proyecto); 

        paramIndex++; 
      }

      if (setClauses.length === 0) return null;

      values.push(email);

      const query = `
        UPDATE 
          gerente 
        SET 
          ${setClauses.join(', ')} 
        WHERE 
          email = $${paramIndex} 
        RETURNING *;
      `;
      
      const result = await pool.query(query, values);

      return result.rows[0];

    } 
    
    // DESARROLLADOR
    else if (usuario.rol === "desarrollador") {

      const { nombre, descripcion, skills } = usuario;

      if (nombre != null) { 

        setClauses.push(`nombre = $${paramIndex}`); 

        values.push(nombre); 

        paramIndex++; 
      }

      if (descripcion != null) { 

        setClauses.push(`descripcion = $${paramIndex}`); 

        values.push(descripcion); 

        paramIndex++; 
      }
      
      if (skills != null) { 

        const skillsStr = Array.isArray(skills) ? skills.join(',') : skills;

        setClauses.push(`skills = $${paramIndex}`); 

        values.push(skillsStr); 

        paramIndex++; 
      }

      if (setClauses.length === 0) return null;

      values.push(email);

      const query = `
        UPDATE 
          desarrollador 
        SET 
          ${setClauses.join(', ')} 
        WHERE 
          email = $${paramIndex} 
        RETURNING *;
      `;
      
      const result = await pool.query(query, values);

      return result.rows[0];
    } 
    
    // INSTITUCION
    else if (usuario.rol === "institucion_educativa") {
      return [{"estado" : "a desarrollar"}];
    }

  } catch (error) {

    console.error("REPOSITORY - Error al actualizar usuario: " + error.message);
    throw Error("Error al actualizar usuario: " + error.message);

  }

};

/* ############# GERENTES ############# */

exports.getAllGerentesRepository = async () => {

  try {

    const result = await pool.query(`SELECT * FROM gerente`);

    return result.rows;

  } catch (error) {

    console.error("REPOSITORY - Error al obtener gerentes: " + error);
    throw Error(error.message);

  } 
};

exports.getGerenteByEmailRepository = async (gerente) => {

  try {

    const query = `SELECT * FROM gerente WHERE email = $1`;

    const values = [gerente.email];

    const result = await pool.query(query, values);

    return result.rows;

  } catch (error) {

    console.error(
      "REPOSITORY - Error al obtener el gerente solicitado: " + error
    );

    throw Error(error.message);

  }
};

exports.createGerenteRepository = async (gerente) => {

  try {

    const query = `
        INSERT INTO gerente (email, id_gerente, id_proyecto, nombre, descripcion)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING email;
    `;

    const values = [
      gerente.email, 
      gerente.id_gerente || "", //  ID de supabase que el front debe enviar
      gerente.id_proyecto || "", 
      gerente.nombre || "", 
      gerente.descripcion || ""
    ];

    await pool.query(query, values);

    return gerente.email;

  } catch (error) {

    console.error("REPOSITORY - Error al crear gerente: " + error.message);
    throw Error(error.message);

  }

};

exports.deleteGerenteRepository = async (gerente) => {

  try {
    const query = `
        DELETE
        FROM
            gerente
        WHERE
            email = $1
        RETURNING email;
    `;

    const values = [gerente.email];


    const result = await pool.query(
      query, values
    );

    return result.rows[0].email_gerente;

  } catch (error) {

    console.error("REPOSITORY - Error al eliminar gerente: " + error.message);
    throw Error(error.message);

  } 

};

/* ############# DESARROLLADORES ############# */

exports.getAllDesarrolladoresRepository = async () => {
  
  try {

    const query =`
      SELECT
          *
      FROM
          desarrollador
    `;

    const result = await pool.query(query);

    return result.rows;

  } catch (error) {

    console.error("REPOSITORY - Error al obtener desarrolladores: " + error);
    throw Error(error.message);

  } 
};

exports.getDesarrolladorByEmailRepository = async (desarrollador) => {

  try {

    const query = `
      SELECT
          *
      FROM
          desarrollador
      WHERE
          desarrollador.email = $1
    `; 

    const values = [desarrollador.email];

    const result = await pool.query(
      query, values
    );

    return result.rows;

  } catch (error) {

    console.error(
      "REPOSITORY - Error al obtener el desarrollador solicitado: " + error
    );

    throw Error(error.message);

  }

};

exports.createDesarrolladorRepository = async (desarrollador) => {

  try {

    const query = `
        INSERT INTO desarrollador (email, id, nombre, apellido, descripcion, fecha_nacimiento)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING email;
    `;

    const values = [
      desarrollador.email,
      desarrollador.id, //  ID de supabase que el front debe enviar
      desarrollador.nombre || "",
      desarrollador.apellido || "",
      desarrollador.descripcion || "",
      desarrollador.fecha_nacimiento || ""
    ];

    await pool.query(query, values);

    return desarrollador.email;

  } catch (error) {

    console.error("REPOSITORY - Error al crear desarrollador: " + error.message);
    throw Error("Error al crear desarrollador: " + error.message);

  } 
};

exports.deleteDesarrolladorRepository = async (desarrollador) => {
 
  try {
    const query = `
        DELETE
        FROM
          desarrollador
        WHERE
          email = $1
        RETURNING email
            
      `;
    
    const values = [desarrollador.email];

    const result = await pool.query(query, values);

    return result.rows[0].email;

  } catch (error) {

    console.error("REPOSITORY - Error al eliminar desarrollador: " + error.message);
    throw Error(error.message);

  } 

};

//actualiza desarrollador por email y retorna todo el objeto actualizado
/* MÉTODO DEPRECADO AHORA RUTIAMOS TODOS LOS PUT DE USUARIO POR EL MÉTODO GENÉRICO DE USUARIO */
//lo migro y dejo por si en alguna parte se sigue usando
exports.updateDesarrolladorByEmailRepository = async (email, desarrollador) => {
  try {

    return await this.updateUsuarioByEmailRepository(email, { ...desarrollador, rol: "desarrollador" });

  } catch (error) {

    console.error("REPOSITORY - Error al actualiza desarrollador: " + error.message);
    throw Error("Error al actualizar desarrollador: " + error.message);

  }
};

//objeto usuario con email y nombre de la tabla
exports.getUserByEmailRepository = async (email, tabla) => {
 

  try {

    if (!TABLAS_PERMITIDAS.includes(tabla)) {
      throw Error('Tabla no permitida');
    }

    const query = `SELECT * FROM ${tabla} WHERE email = $1`;

    const values = [email];

    const result = await pool.query(query, values);

    return result.rows[0];;

  } catch (error) {

    console.error(
      "REPOSITORY - Error al obtener el usuario solicitado: " + error
    );

    throw Error(error.message);

  } 
};

/* ############# INSTITUCIONES EDUCATIVAS ############# */
exports.getAllInstitucionesRepository = async () => {
 
  try {

    const query = `
      SELECT
          *
      FROM
          institucion_educativa
    `;
  
    const result = await pool.query(query);

    return result.rows;

  } catch (error) {

    console.error("REPOSITORY - Error al obtener instituciones educativas: " + error);
    throw Error(error.message);

  }
};

exports.getInstitucionByEmailRepository = async (institucion) => {

  try {
    
    const query = `
      SELECT
          *
      FROM
          institucion_educativa
      WHERE
          email = $1
    `;

    const values = [institucion.email];

    const result = await pool.query(query, values);

    return result.rows;

  } catch (error) {

    console.error(
      "REPOSITORY - Error al obtener la institucion educativa solicitada: " + error
    );
    throw Error(error.message);

  }
};


exports.createInstitucionRepository = async (institucion) => {

  try {
    
    const query = `
      INSERT INTO
          institucion_educativa(id, nombre, email)
      VALUES
          ($1, $2, $3)
      RETURNING email
    `;

    const values = [institucion.id, institucion.nombre, institucion.email]


    const result = await pool.query(query, values);

    return result.rows[0].email;

  } catch (error) {

    console.error("REPOSITORY - Error al crear institucion educativa: " + error.message);
    throw Error(error.message);

  }
};

exports.deleteInstitucionRepository = async (institucion) => {

  try {
    const query = `
      DELETE
      FROM
          institucion_educativa
      WHERE
          email = $1
      RETURNING email;
    `;

    const values = [institucion.email];

    const result = await pool.query(query, values);

    //si elimino qu devuelva el email si no null, debo ponerlo en todos los deletes
    return result.rows.length > 0 ? result.rows[0].email : null;

  } catch (error) {

    console.error("REPOSITORY - Error al eliminar institucion educativa: " + error.message);
    throw Error(error.message);

  }

};