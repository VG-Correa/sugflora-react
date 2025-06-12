import api from "./api";

const UsuarioApi = {
  async getUserByUsername(username) {
    try {
      const response = await api.get("usuario/username/" + username);
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async getUserByEmail(email) {
    try {
      const response = await api.get("usuario/email/" + email);
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async update(usuario) {
    try {
      const response = await api.put("usuario", usuario);
      return response;
    } catch (error) {
      console.log("(API) Erro ao salvar usuario ", error);
      return null;
    }
  },
};

export default UsuarioApi;
