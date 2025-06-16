import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const API_URL = Platform.select({
  android: "http://localhost:8080/api/projeto", // Android
  ios: "http://localhost:8080/api/projeto", // iOS
  default: "http://localhost:8080/api/projeto", // Fallback
});

const projetoApi = {
  async create(projeto) {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
      }

      // Processar imagem base64 se existir
      if (projeto.imagemBase64) {
        let base64Data = projeto.imagemBase64;
        if (base64Data.includes(",")) {
          base64Data = base64Data.split(",")[1];
        }
        projeto.imagemBase64 = base64Data;
      }

      console.log("Enviando dados para API:", projeto);
      console.log("URL da API:", API_URL);

      const response = await axios.post(API_URL, projeto, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        validateStatus: function (status) {
          return status < 500; // Aceita qualquer status menor que 500
        },
      });

      console.log("Resposta da API:", response.data);

      if (response.status >= 400) {
        throw new Error(response.data.message || "Erro ao criar projeto");
      }

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
          Accept: "application/json",
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
          Accept: "application/json",
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
      if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
      }

      // Processar imagem base64 se existir
      if (projeto.imagemBase64) {
        let base64Data = projeto.imagemBase64;
        if (base64Data.includes(",")) {
          base64Data = base64Data.split(",")[1];
        }
        projeto.imagemBase64 = base64Data;
      }

      const response = await axios.put(API_URL, projeto, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
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
          Accept: "application/json",
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
          Accept: "application/json",
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
          Accept: "application/json",
        },
      });
      return response;
    } catch (error) {
      console.error("Erro ao buscar projeto:", error);
      throw error;
    }
  },

  async getImagem(id) {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${API_URL}/${id}/imagem`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "arraybuffer",
      });
      return response;
    } catch (error) {
      console.error("Erro ao buscar imagem do projeto:", error);
      throw error;
    }
  },

  async reactive(id) {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(`${API_URL}/reactive/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
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
