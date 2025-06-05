import api from "./api"


const ColetaApi = {
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