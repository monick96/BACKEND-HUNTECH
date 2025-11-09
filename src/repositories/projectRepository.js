const getPool = require("../dataBase/conexionSQL");
const crypto = require('crypto');
//CAPA REPOSITORY : metodos de CRUD a la DB
//usamos return para enviar resultado a service y 
// throw error para propagar el error y que lo tome el service,
// y finalmente lo retorne controller

exports.createProyectRepository = async (project) => {
    try {

        dbPool = await getPool();

        let id = crypto.randomUUID();//id random con libreria incluida en node

        const query = `
            INSERT INTO 
            dbo.proyecto (id, nombre, description, info_link, 
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
            .input('id_gerente', project.id_gerente)
            .input('email_gerente', project.email_gerente)
            .query(query);
            
        return id;
        
    } catch (error) {

        console.error('REPOSITORY - Error al crear proyecto: ' + error.message);

        throw Error(error.message);
    }
    
}