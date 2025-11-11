const contractRepository = require('../repositories/contractRepository');

exports.getAllContracts = async () => {

    try {
        return await contractRepository.getAllContractsRepository();
    } catch (error) {
        console.error('SERVICE - Error al obtener contratos: ' + error);
        throw Error('Error al obtener contratos: ' + error.message);
    }
}