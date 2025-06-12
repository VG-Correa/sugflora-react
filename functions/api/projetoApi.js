import api from "./api";

const ProjetoApi = {
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
      const response = await api.post("projeto", projeto);
      return response;
    } catch (error) {
      console.log("(API) Erro ao salvar projeto ", error.response?.data || error.message);
      return null;
    }
  },

  async update(projeto) {
    try {
      const response = await api.put("projeto", projeto);
      return response;
    } catch (error) {
      console.log("(API) Erro ao salvar projeto ", error);
      return null;
    }
  },

  async delete(projeto_id) {
    try {
      const response = await api.delete("projeto/delete/" + projeto_id);
      return response;
    } catch (error) {
      console.log("(API) Erro ao deletar projeto ", error);
      return null;
    }
  }
};

export default ProjetoApi;
