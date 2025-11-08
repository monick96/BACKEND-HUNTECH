const institucionService = require('../services/institucionService');

exports.readInstituciones = async(req, res)=>{
    try {

        result = await institucionService.getAllInstituciones();

        res.status(200);

        res.json({ 
            message: 'institucion educativa obtenida correctamente', 
            count: result.length, 
            data: result 
        });
        
    } catch (error) {

        console.error('Error al obtener instituciones educativas: ' + error);

        res.status(500)

        res.json({ error: 'Error al obtener instituciones educativas: '+ error.message });
    }
}

// funcion flecha asicronica por expresion
exports.createInstitucion = async(req, res)=>{
    try {

        let institucion = req.body;

        //retorna id de institucion creado o error
        result = await institucionService.createInstitucion(institucion);

        res.status(201);
        res.json({ message: 'institucion educativa creada', institucionId: result });
        
    } catch (error) {

        console.error('Error al crear institucion educativa: ' + error);

        res.status(500)

        res.json({ error: 'Error al crear institucion educativa: '+ error.message });
    }
}