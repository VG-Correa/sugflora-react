import api from "./api";

const CampoApi = {
  async getAllByProjetoId(projeto_id) {
    try {
      const response = await api.get("campo/projeto/" + projeto_id);
      return response;
    } catch (error) {
      console.error("Erro ao buscar campos do projeto:", error);
      throw error;
    }
  },

  async getAllByUsuarioId(usuario_id) {
    try {
      const response = await api.get("campo/usuario/" + usuario_id);
      return response;
    } catch (error) {
      console.error("Erro ao buscar campos do usuário:", error);
      throw error;
    }
  },

  async create(campoJson) {
    try {
      // Validar dados obrigatórios
      if (!campoJson.projeto_id) {
        throw new Error("ID do projeto é obrigatório");
      }
      if (!campoJson.usuario_responsavel_uuid) {
        throw new Error("ID do usuário responsável é obrigatório");
      }
      if (!campoJson.nome) {
        throw new Error("Nome do campo é obrigatório");
      }
      if (!campoJson.data_inicio) {
        throw new Error("Data de início é obrigatória");
      }

      const response = await api.post("campo", campoJson);
      return response;
    } catch (error) {
      console.error("Erro ao criar campo:", error);
      throw error;
    }
  },

  async update(id, campoJson) {
    try {
      const response = await api.put("campo/" + id, campoJson);
      return response;
    } catch (error) {
      console.error("Erro ao atualizar campo:", error);
      throw error;
    }
  },
};

export default CampoApi;
