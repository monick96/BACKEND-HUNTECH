const usuariosRepository = require("../repositories/usuariosRepository");

/* USUARIOS */

exports.chequearSiExisteUsuarioConEmail = async (usuario) => {
  //console.log('SERVICE usuario: ', usuario)
  try {
    if (!usuario.email) {
      throw Error("Se debe indicar el email del usuario a buscar");
    }
    return await usuariosRepository.chequearSiExisteUsuarioConEmail(usuario);
  } catch (error) {
    console.error("SERVICE - Error al chequear si existen usuarios: " + error);
    throw Error("Error al chequear si existen usuarios: " + error.message);
  }
};

/* GERENTES */

exports.getAllGerentes = async () => {
  try {
    return await usuariosRepository.getAllGerentesRepository();
  } catch (error) {
    console.error("SERVICE - Error al obtener gerentes: " + error);
    throw Error("Error al obtener gerentes: " + error.message);
  }
};

exports.getGerenteByEmail = async (gerente) => {
  try {
    if (!gerente.email) {
      throw Error("Se debe indicar el email del gerente a buscar");
    }
    return await usuariosRepository.getGerenteByEmailRepository(gerente);
  } catch (error) {
    console.error("SERVICE - Error al buscar ese gerente: " + error);
    throw Error("Error al buscar ese gerente: " + error.message);
  }
};

exports.createGerente = async (gerente) => {
  try {
    if (!gerente.email) {
      throw Error("Se debe indicar el email del gerente");
    }
    return await usuariosRepository.createGerenteRepository(gerente);
  } catch (error) {
    console.error("SERVICE - Error al crear gerente: " + error);
    throw Error("Error al crear gerente: " + error.message);
  }
};

exports.deleteGerente = async (gerente) => {
  try {
    if (!gerente.email) {
      throw Error("Se debe indicar el email del gerente a eliminar");
    }
    return await usuariosRepository.deleteGerenteRepository(gerente);
  } catch (error) {
    console.error("SERVICE - Error al eliminar gerente: " + error);
    throw Error("Error al eliminar gerente: " + error.message);
  }
};

/* ############# DESARROLLADORES ############# */
exports.createDesarrollador = async (desarrollador) => {
  try {
    if (!desarrollador.email) {
      throw Error("Se debe indicar el email del desarrollador");
    }
    return await usuariosRepository.createDesarrolladorRepository(desarrollador);
  } catch (error) {
    console.error("SERVICE - Error al crear desarrollador: " + error);
    throw Error("Error al crear desarrollador: " + error.message);
  }
};