import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://10.0.2.2:8080/api/projeto";

const projetoApi = {
  async create(projeto) {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
      }

      console.log("Enviando dados para API:", projeto);

      const response = await axios.post(API_URL, projeto, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Resposta da API:", response.data);
      return response;
    } catch (error) {
      console.error("Erro ao criar projeto:", error.response?.data || error);
      throw error;
    }
  },

  async getAll() {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
      throw error;
    }
  },

  async getProjetos(userId) {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${API_URL}/usuario/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Erro ao buscar projetos do usuário:", error);
      throw error;
    }
  },

  async update(projeto) {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(API_URL, projeto, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.delete(`${API_URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Erro ao deletar projeto:", error);
      throw error;
    }
  },

  async forceDelete(id) {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.delete(`${API_URL}/force-delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Erro ao excluir permanentemente o projeto:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Erro ao buscar projeto:", error);
      throw error;
    }
  },

  async reactive(id) {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(`${API_URL}/reactive/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Erro ao reativar projeto:", error);
      throw error;
    }
  },
};

export default projetoApi;
