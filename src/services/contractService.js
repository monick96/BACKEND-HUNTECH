const contractRepository = require('../repositories/contractRepository');

exports.getAllContracts = async () => {

    try {
        return await contractRepository.getAllContractsRepository();
    } catch (error) {
        console.error('SERVICE - Error al obtener contratos: ' + error);
        throw Error('Error al obtener contratos: ' + error.message);
    }
}

exports.getAllNonOccuppiedContracts = async () => {

    try {
        return await contractRepository.getAllNotOcuppiedContractsRepository();
    } catch (error) {
        console.error('SERVICE - Error al obtener contratos libres: ' + error);
        throw Error('Error al obtener contratos libres: ' + error.message);
    }
}

exports.getContractsByGerenteEmail = async (emailGerente) => {
    try {
        return await contractRepository.getContractsByGerenteEmail(emailGerente);
    } catch (error) {
        console.error(`SERVICE - Error al obtener contratos para el gerente ${emailGerente}: ` + error);
        throw Error(`Error al obtener contratos para el gerente ${emailGerente} `+ error.message);        
    }
}

exports.createContract = async (contract) => { 
    try {
        if (!contract.tipo) {
            throw Error('Se debe indicar el tipo de contrato' );
        }
        if (!contract.titulo) {
            throw Error('Se debe indicar el título del contrato' );
        }
        if (!contract.proyecto_id) {
            throw Error('Se debe indicar proyecto_id del contrato');
        }
        if (typeof contract.tiene_postulaciones !== 'boolean') {
            throw Error('El campo "tiene_postulaciones" debe ser booleano');
        }
        if (typeof contract.esta_ocupado !== 'boolean') {
            throw Error('El campo "esta_ocupado" debe ser booleano');
        }

        return await contractRepository.createContractRepository(contract)
        
    } catch (error) {
        console.error('SERVICE - Error al crear contrato: ' + error);
        throw Error('Error al crear Contrato: ' + error.message);
    }
}

exports.updateContract = async (id, contractUpdated) => {
    try {
        //console.log("SERVICE - UpdateContract")
        //console.log(`PUT Contract - Body: ${contractUpdated}, - URL Param: ${id}`)
        return await contractRepository.updateContractRepository(id, contractUpdated)
    } catch (error) {
        console.log("Error en SERVICE - updateContract - " + error)
        throw Error("Error en SERVICE - updateContract - " + error)
    }
}