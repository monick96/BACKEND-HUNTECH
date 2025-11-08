//para las querys tipo://al final no lo usamos

const QUERYS = {
    GET_ALL_PROYECTOS: `SELECT * FROM proyecto`,
    GET_PROYECTO_BY_ID: `SELECT * FROM proyecto WHERE id = @id`,
    INSERT_PROYECTO: `
    INSERT INTO proyecto (id, nombre, descripcion, info_link, buscando_devs)
    VALUES (@id, @nombre, @descripcion, @info_link, @buscando_devs)
    `
};

module.exports = QUERYS; 