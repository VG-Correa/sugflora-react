import api from "./api"


const ColetaApi = {

    async create(coleta) {
        try {
            const response = await api.post("coleta", coleta)
            return response;
        } catch (error) {
            throw error
        }
    },

    async getColetasByCampoId(campo_id) {
        try {
            const response = await api.get("coleta/campo/" + campo_id)
            return response;
        } catch (error) {
            throw error;
        }

    }
}

export default ColetaApi;