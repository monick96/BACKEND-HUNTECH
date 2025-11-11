const usuariosService = require('../services/usuariosService')

exports.readUsuarioExistByEmail = async(req, res)=>{
    try {
        result = await usuariosService.chequearSiExisteUsuarioConEmailRetornarNombreTabla(req.body);
        res.status(200);
        res.json({ 
            message: 'El usuario ya existe en la DB', 
            count: result.length, 
            data: result 
        });
        
    } catch (error) {
        console.error('Error al buscar usuario por email: ' + error);
        res.status(500)
        res.json({ error: 'Error al buscar usuario por email: '+ error.message });
    }
}

exports.readGerentes = async(req, res)=>{
    try {
        result = await usuariosService.getAllGerentes(),
        res.status(200);
        res.json({ 
            message: 'gerentes obtenidos correctamente', 
            count: result.length, 
            data: result 
        });
        
    } catch (error) {
        console.error('Error al obtener gerentes: ' + error);
        res.status(500)
        res.json({ error: 'Error al obtener gerentes: '+ error.message });
    }
}

exports.readGerenteByEmail = async(req, res) => {
    try {
        let gerente = req.body;
        result = await usuariosService.getGerenteByEmail(gerente)
        res.status(201);       
        if (result.length == 0) {
        res.json({ 
            message: 'No hay ningún gerente con ese email',
            count: result.length,
            data:result });    
        } else {
            res.json({ 
            message: 'gerente hallado',
            count: result.length,
            data:result });
        }
    } catch (error) {
        console.error('Error al obtener el gerente: ' + error);
        res.status(500)
        res.json({ error: 'Error al obtener el gerente: '+ error.message });
    }
}

exports.createGerente = async(req, res)=>{
    try {
        let gerente = req.body;

        const elEmailYaEstaEnUso = await usuariosService.chequearSiExisteUsuarioConEmail(gerente);

        if (elEmailYaEstaEnUso == 1) {
            return res.status(400).json({ message: 'Ya existe un usuario con ese email' });
        }

        result = await usuariosService.createGerente(gerente)
        res.status(201);       
        res.json({ message: 'gerente creado', email_gerente:result });   
    
    }  
    catch (error) {
        console.error('Error al crear gerente: ' + error);
        res.status(500)
        res.json({ error: 'Error al crear gerente: '+ error.message });
    }
}
    
exports.deleteGerente = async(req, res)=>{
    try {
        let gerente = req.body;
        result = await usuariosService.deleteGerente(gerente)
        res.status(201);       
        res.json({ message: 'gerente eliminado', gerente_email:result });
        
    } catch (error) {
        console.error('Error al eliminar gerente: ' + error);
        res.status(500)
        res.json({ error: 'Error al elimninar gerente: '+ error.message });
    }
}

/* ############# DESARROLLADORES ############# */
exports.createDesarrollador = async(req, res)=>{
    try {
        let desarrollador = req.body;

        const elEmailYaEstaEnUso = await usuariosService.chequearSiExisteUsuarioConEmail(desarrollador);

        if (elEmailYaEstaEnUso == 1) {
            return res.status(400).json({ message: 'Ya existe un usuario con ese email' });
        }

        result = await usuariosService.createDesarrollador(desarrollador)
        res.status(201);       
        res.json({ message: 'desarrollador creado', email:result });   
    
    }  
    catch (error) {
        console.error('Error al crear desarrollador: ' + error);
        res.status(500)
        res.json({ error: 'Error al crear desarrollador: '+ error.message });
    }
}

exports.updateDesarrolladorByEmail = async(req, res)=>{
    try {
        let {email} = req.params;
        let {desarrollador} = req.body;

        let result = await usuariosService.updateDesarrolladorByEmail(email,desarrollador);

        res.status(200);       
        res.json({ message: 'desarrollador actualizado', data:result });   
    
    }  
    catch (error) {
        console.error('Error al actualizar desarrollador: ' + error);
        res.status(500)
        res.json({ error: 'Error al actualizar desarrollador: '+ error.message });
    }
}

exports.readUserByEmail = async(req, res)=>{
    try {
        let {email, tabla} = req.params;

        result = await usuariosService.getUserByEmail(email, tabla);

        res.status(200);
        if (result.length == 0) {
        res.json({ 
            message: 'No hay ningún Usuario en ' +tabla+ ' con ese email',
            count: result.length,
            data:result });    
        } else {
            res.json({ 
                message: 'Usuario obtenido correctamente', 
                count: result.length, 
                data: result 
            });
        }
        
    } catch (error) {
        console.error('Error al obtener Usuario: ' + error);
        res.status(500)
        res.json({ error: 'Error al obtener Usuario: '+ error.message });
    }
}