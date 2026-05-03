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

      const { id_gerente, id_proyecto, nombre, descripcion, esta_validado, validado_por_usuario_id} = usuario;

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

      if (esta_validado != null) { 

        setClauses.push(`esta_validado = $${paramIndex}`); 

        values.push(esta_validado);

        paramIndex++; 
      }

      if (validado_por_usuario_id != null) { 

        setClauses.push(`validado_por_usuario_id = $${paramIndex}`); 

        values.push(validado_por_usuario_id);

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

      /*const { nombre, apellido, descripcion, skills, perfil_it, fecha_nacimiento, esta_validado, validado_por_usuario_id, genero} = usuario;

      if (nombre != null) { 

        setClauses.push(`nombre = $${paramIndex}`); 

        values.push(nombre); 

        paramIndex++; 
      }

      if (apellido != null) { 

        setClauses.push(`apellido = $${paramIndex}`); 

        values.push(apellido); 

        paramIndex++; 
      }

      if (perfil_it != null) { 

        setClauses.push(`perfil_it = $${paramIndex}`); 

        values.push(perfil_it); 

        paramIndex++; 
      }

      if (fecha_nacimiento != null) { 

        setClauses.push(`fecha_nacimiento = $${paramIndex}`); 

        values.push(fecha_nacimiento); 

        paramIndex++; 
      }

      if (esta_validado != null) { 

        setClauses.push(`esta_validado = $${paramIndex}`); 

        values.push(esta_validado);

        paramIndex++; 
      }

      if (validado_por_usuario_id != null) { 

        setClauses.push(`validado_por_usuario_id = $${paramIndex}`); 

        values.push(validado_por_usuario_id);

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
      if (genero != null) { 

        setClauses.push(`genero = $${paramIndex}`); 

        values.push(genero); 

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

      return result.rows[0];*/

      return await updateDesarrolladorTransaccional(email, usuario);
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

////metodo transaccional(si algo falla que falle todo y no cambie nada) para update dev por las tablas nuevas idioma y habilidades
//solo se utiliza en el repositorio asi que no uso exports
const updateDesarrolladorTransaccional = async (email, usuario) => {
  const client = await pool.connect();//este pool se encarga de principio a fin de esta operacion update

  try {
    await client.query('BEGIN');

    // variables solo para el dev
    let setClauses = [];
    let values = [];
    let paramIndex = 1;
    const { nombre, apellido, descripcion, skills, perfil_it, fecha_nacimiento, esta_validado, validado_por_usuario_id, genero, esta_disponible} = usuario;
    //evaluamos los campos con datos simples para update en dev
    if (nombre != null) { 

      setClauses.push(`nombre = $${paramIndex}`); 

      values.push(nombre); 

      paramIndex++; 
    }

    if (apellido != null) { 

      setClauses.push(`apellido = $${paramIndex}`); 

      values.push(apellido); 

      paramIndex++; 
    }

    if (perfil_it != null) { 

      setClauses.push(`perfil_it = $${paramIndex}`); 

      values.push(perfil_it); 

      paramIndex++; 
    }

    if (fecha_nacimiento != null) { 

      setClauses.push(`fecha_nacimiento = $${paramIndex}`); 

      values.push(fecha_nacimiento); 

      paramIndex++; 
    }

    if (esta_validado != null) { 

      setClauses.push(`esta_validado = $${paramIndex}`); 

      values.push(esta_validado);

      paramIndex++; 
    }

    if (validado_por_usuario_id != null) { 

      setClauses.push(`validado_por_usuario_id = $${paramIndex}`); 

      values.push(validado_por_usuario_id);

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

    if (genero != null) { 

      setClauses.push(`genero = $${paramIndex}`); 

      values.push(genero); 

      paramIndex++; 
    }

    if (esta_disponible != null) { 

      setClauses.push(`esta_disponible = $${paramIndex}`); 

      values.push(esta_disponible);

      paramIndex++; 
    }

    if (setClauses.length > 0) {
      //hacemos update de los campos simples si es que vinieron en el body
      values.push(email);
      const query = `UPDATE desarrollador SET ${setClauses.join(', ')} WHERE email = $${paramIndex} RETURNING *;`;
      // usamos client.query en lugar de pool.query, el mismo pool
      await client.query(query, values); 
    }

    // metodos para verificar y hacer update, insert o delete en idiomas y habilidades
    if (usuario.idiomas) {
      await sincronizarIdiomas(client, email, usuario.idiomas);
    }

    if (usuario.habilidades) {
      await sincronizarHabilidades(client, email, usuario.habilidades);
    }

    await client.query('COMMIT');
    
    // voy a re utilizar el getUserByEmailRepository para retornar el usuario actualizado
    return await this.getUserByEmailRepository(email, 'desarrollador'); 

  } catch (error) {
    await client.query('ROLLBACK');

    console.error("Transacción fallida en desarrollador, usuarios repository:", error.message);
    throw error;

  } finally {

    client.release();//libera este pool

  }
};

const sincronizarHabilidades = async (client, email, habilidadesFrontend) => {
  // obtenemos el estado actual de habilidades en la base de datos de ese email
  const resDB = await client.query(
    "SELECT nombre_habilidad, nivel_habilidad FROM habilidad_x_desarrollador WHERE email_desarrollador = $1",
    [email]
  );

  const habilidadesDB = resDB.rows;

  // nos quedamos solo los nombres para simplificar la comparación
  const nombresFrontend = habilidadesFrontend.map(h => h.nombre_habilidad);
  const nombresDB = habilidadesDB.map(h => h.nombre_habilidad);

  // verificamos cuáles existen en DB pero ya no vienen del Frontend
  const aBorrar = nombresDB.filter(nombre => !nombresFrontend.includes(nombre));

  if (aBorrar.length > 0) {
    await client.query(
      "DELETE FROM habilidad_x_desarrollador WHERE email_desarrollador = $1 AND nombre_habilidad = ANY($2)",
      [email, aBorrar]
    );
  }

  // Iteramos sobre lo que envió el frontend para actualizar o insertar
  for (const habFront of habilidadesFrontend) {
    if (nombresDB.includes(habFront.nombre_habilidad)) {
      // Ya existía en DB -> UPDATE (por si cambió el nivel)
      await client.query(
        "UPDATE habilidad_x_desarrollador SET nivel_habilidad = $1 WHERE email_desarrollador = $2 AND nombre_habilidad = $3",
        [habFront.nivel_habilidad, email, habFront.nombre_habilidad]
      );
    } else {
      // si no existe, INSERT
      await client.query(
        "INSERT INTO habilidad_x_desarrollador (email_desarrollador, nombre_habilidad, nivel_habilidad) VALUES ($1, $2, $3)",
        [email, habFront.nombre_habilidad, habFront.nivel_habilidad]
      );
    }
  }
};

// update los idiomas de un desarrollador
const sincronizarIdiomas = async (client, email, idiomasFrontend) => {
  // idiomas del dev en db
  const resDB = await client.query(
    "SELECT nombre_idioma, nivel_idioma FROM idioma_x_desarrollador WHERE email_desarrollador = $1", 
    [email]
  );
  const idiomasDB = resDB.rows; // [{nombre_idioma: 'Inglés', nivel: 'Básico'}]

  // nos quedamos con los nombres
  const nombresFrontend = idiomasFrontend.map(i => i.nombre_idioma);
  const nombresDB = idiomasDB.map(i => i.nombre_idioma);

  // cualesestan en la DB pero NO en el front
  const aBorrar = nombresDB.filter(nombre => !nombresFrontend.includes(nombre));
  
  if (aBorrar.length > 0) {
    // Usamos el operador ANY para borrar varios en una sola consulta
    await client.query(
      "DELETE FROM idioma_x_desarrollador WHERE email_desarrollador = $1 AND nombre_idioma = ANY($2)",
      [email, aBorrar] 
    );
  }

  // hay que AGREGAR y/o ACTUALIZAR?
  for (const idiomaFront of idiomasFrontend) {
    if (nombresDB.includes(idiomaFront.nombre_idioma)) {
      // Ya existía en DB -> UPDATE (por si cambió el nivel)
      await client.query(
        "UPDATE idioma_x_desarrollador SET nivel_idioma = $1 WHERE email_desarrollador = $2 AND nombre_idioma = $3",
        [idiomaFront.nivel_idioma, email, idiomaFront.nombre_idioma]
      );
    } else {
      // No existía en DB -> INSERT
      await client.query(
        "INSERT INTO idioma_x_desarrollador (email_desarrollador, nombre_idioma, nivel_idioma) VALUES ($1, $2, $3)",
        [email, idiomaFront.nombre_idioma, idiomaFront.nivel_idioma]
      );
    }
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

    return result.rows.length > 0 ? result.rows[0].email : null;

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
        INSERT INTO desarrollador (email, id, nombre, apellido, descripcion, fecha_nacimiento, perfil_it, skills)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING email;
    `;

    const values = [
      desarrollador.email,
      desarrollador.id, //  ID de supabase que el front debe enviar
      desarrollador.nombre || "",
      desarrollador.apellido || "",
      desarrollador.descripcion || "",
      desarrollador.fecha_nacimiento || "",
      desarrollador.perfil_it || "",
      desarrollador.skills || ""
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

    return result.rows.length > 0 ? result.rows[0].email : null;

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

    // obbtenemos los datos para gerentes, devs e instituciones
    const queryPrincipal = `SELECT * FROM ${tabla} WHERE email = $1`;
    const resultPrincipal = await pool.query(queryPrincipal, [email]);
    let usuarioBase = resultPrincipal.rows[0];

    // si usuario no existe en la DB o si no es desarrollador, 
    // cortamos la ejecución y devolvemos 
    if (!usuarioBase || tabla !== 'desarrollador') {
      return usuarioBase;
    }

    //voy a usar lo aprendido en concurrencia 
    // y voy a lanzar dos consultas en paralelo para que no sea tan lento
    //si el user es desarrollador
    const [resultadosIdiomas, resultadosHabilidades] = await Promise.all([
      pool.query("SELECT nombre_idioma, nivel_idioma FROM idioma_x_desarrollador WHERE email_desarrollador = $1", [email]),
      pool.query("SELECT nombre_habilidad, nivel_habilidad FROM habilidad_x_desarrollador WHERE email_desarrollador = $1", [email])
    ]);

    // asocio al usuario los resultados , para que lo maneje el front
    usuarioBase.idiomas = resultadosIdiomas.rows;
    usuarioBase.habilidades = resultadosHabilidades.rows;

    return usuarioBase;

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