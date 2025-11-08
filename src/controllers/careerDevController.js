const careerDevService = require('../services/careerDevService');

exports.readCareerDevs = async (req, res) => {
    try {
        const result = await careerDevService.getAllCareerDevs();

        res.status(200).json({ 
            message: 'Carreras por desarrollador obtenidas correctamente', 
            count: result.length, 
            data: result 
        });
        
    } catch (error) {
        console.error('Error al obtener carreras por desarrollador: ' + error);

        res.status(500).json({ 
            error: 'Error al obtener carreras por desarrollador: ' + error.message 
        });
    }
};

exports.createCareerDev = async (req, res) => {
    try {
        const careerDev = req.body;

       
        const result = await careerDevService.createCareerDev(careerDev);

        res.status(201).json({ 
            message: 'Carrera por desarrollador creada correctamente', 
            careerDevId: result 
        });
        
    } catch (error) {
        console.error('Error al crear carrera por desarrollador: ' + error);

        res.status(500).json({ 
            error: 'Error al crear carrera por desarrollador: ' + error.message 
        });
    }
};
