import api from "./api"


export default  ProjetoApi = {
    async getProjetos(user_id) {
        try {
            const response = await api.get("projeto/usuario/" + user_id);
            return response;            
        } catch (error) {
            console.log("Erro no GET projetos por usuário", error);
        }

    },

    async create(projeto) {

        try {
            const response = await api.post("projeto", projeto)
            return response;
        } catch (error) {
            console.log("(API) Erro ao salvar projeto ", error);
            return null;
        }

    }
}