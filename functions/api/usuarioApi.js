import api from "./api";
import axios from "axios";
import { Platform } from "react-native";

const API_URL = Platform.select({
  android: "http://10.0.2.2:8080/api", // Android Emulator
  ios: "http://localhost:8080/api", // iOS Simulator
  default: "http://localhost:8080/api", // Fallback
});

const UsuarioApi = {
  async create(usuario) {
    try {
      const usuarioWriteDTO = {
        username: usuario.username,
        nome: usuario.nome,
        sobrenome: usuario.sobrenome || "",
        email: usuario.email,
        senha: usuario.senha,
        cpf: usuario.cpf.replace(/\D/g, ""),
        rg: usuario.rg.replace(/\D/g, ""),
        endereco: usuario.endereco,
        role: "USER",
      };

      console.log("Enviando UsuarioWriteDTO:", usuarioWriteDTO);
      console.log("URL da API:", `${API_URL}/usuario`);

      try {
        console.log("Tentando requisição direta com axios...");
        const response = await axios.post(
          `${API_URL}/usuario`,
          usuarioWriteDTO,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            validateStatus: function (status) {
              return status < 500;
            },
          }
        );

        console.log("Resposta do servidor (axios):", response.data);
        return response;
      } catch (axiosError) {
        console.log(
          "Erro com axios direto, tentando api configurada:",
          axiosError
        );

        const response = await api.post("/usuario", usuarioWriteDTO);
        console.log("Resposta do servidor (api):", response.data);
        return response;
      }
    } catch (error) {
      console.error(
        "(API) Erro ao criar usuário:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async getUserByUsername(username) {
    try {
      const response = await api.get(`/usuario/username/${username}`);
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async getUserByUuid(uuid) {
    try {
      const response = await api.get(`/usuario/${uuid}`);
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async update(usuario) {
    try {
      const response = await api.put("/usuario", usuario);
      return response;
    } catch (error) {
      console.log("(API) Erro ao salvar usuario ", error);
      return null;
    }
  },

  async delete(uuid) {
    try {
      const response = await api.delete(`/usuario/${uuid}`);
      return response;
    } catch (error) {
      console.log("(API) Erro ao deletar usuario ", error);
      return null;
    }
  },

  async getAll() {
    try {
      const response = await api.get("/usuario");
      return response;
    } catch (error) {
      console.log("(API) Erro ao buscar usuarios ", error);
      return null;
    }
  },
};

export default UsuarioApi;
