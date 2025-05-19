import api from "./api"

const CampoApi = {

    async getAllByProjetoId(projeto_id) {
        
        try {
            const response = api.get("campo/projeto/" + projeto_id)
            return response;

        } catch (error) {
            console.error("Erro no GET dos campos: ", error)
        }
    }

}

export default CampoApi;