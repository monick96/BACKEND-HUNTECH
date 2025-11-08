const CareerService = require('../services/careerService');



exports.readCareers = async(req, res)=>{
    try {

        result = await CareerService.getAllCareers();

        res.status(200);

        res.json({ 
            message: 'carreras obtenidas correctamente', 
            count: result.length, 
            data: result 
        });
        
    } catch (error) {

        console.error('Error al obtener carreras: ' + error);

        res.status(500)

        res.json({ error: 'Error al obtener carreras: '+ error.message });
    }
}


exports.createCareer = async(req, res)=>{
    try {

        let Career = req.body;

        result = await CareerService.createCareer(Career);

        res.status(201);
        res.json({ message: 'carrera creada', CareerId: result });
        
    } catch (error) {

        console.error('Error al crear Carrera: ' + error);

        res.status(500)

        res.json({ error: 'Error al crear Carreras: '+ error.message });
    }
}       
