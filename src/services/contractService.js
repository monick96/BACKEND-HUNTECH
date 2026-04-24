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
        return await contractRepository.getContractsByGerenteEmailRepository(emailGerente);
    } catch (error) {
        console.error(`SERVICE - Error al obtener contratos para el gerente ${emailGerente}: ` + error);
        throw Error(`Error al obtener contratos para el gerente ${emailGerente} ` + error.message);
    }
}

exports.createContract = async (contract) => {
    try {
        if (!contract.tipo) {
            throw Error('Se debe indicar el tipo de contrato');
        }
        if (!contract.titulo) {
            throw Error('Se debe indicar el título del contrato');
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
        if (!contract.modalidad) {
            throw Error('Se debe indicar la modalidad del contrato');
        }
        const MODALIDADES_VALIDAS = ['remoto', 'presencial', 'hibrido'];
        if (!MODALIDADES_VALIDAS.includes(contract.modalidad)) {
            throw Error(`La modalidad debe ser una de: ${MODALIDADES_VALIDAS.join(', ')}`);
        }
        if (!contract.seniority_deseado || !Array.isArray(contract.seniority_deseado) || contract.seniority_deseado.length === 0) {
            throw Error('Se debe indicar al menos un seniority deseado (array)');
        }
        const SENIORITIES_VALIDOS = ['Trainee', 'Junior', 'Semisenior', 'Senior', 'Indistinto'];
        const invalidos = contract.seniority_deseado.filter(s => !SENIORITIES_VALIDOS.includes(s));
        if (invalidos.length > 0) {
            throw Error(`Seniority inválido: ${invalidos.join(', ')}. Válidos: ${SENIORITIES_VALIDOS.join(', ')}`);
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

exports.asignarCandidato = async (id, emailPasante) => {
    try {
        if (!emailPasante || typeof emailPasante !== 'string' || emailPasante.trim() === '') {
            throw Error('Se debe indicar un emailPasante válido');
        }
        const resp = await contractRepository.asignarCandidatoRepository(id, emailPasante);
        if (resp?.notFound) {
            throw Error("NOT_FOUND");
        }
        if (resp?.alreadyOccupied) {
            throw Error("OCCUPIED");
        }
        return resp;
    } catch (error) {
         if (error instanceof Error) {
            throw error;
        } else {
            throw new Error("Error en SERVICE - asignarCandidato - " + error);
        }
    }
};

exports.deleteContract = async (id) => {
    try {
        if (!id) {
            throw Error("Se debe indicar la id del contrato a eliminar");
        }
        return await contractRepository.deleteContractRepository(id)
    } catch (error) {
        console.error("SERVICE - Error al eliminar contrato: " + error);
        throw Error("Error al eliminar contrato: " + error.message);
    }
};