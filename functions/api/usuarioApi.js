import api from "./api"


const UsuarioApi = {

    async getUserByUsername(username) {
        try {
            const response = await api.get("usuario/username/" + username)
            return response;

        } catch (error) {
            console.log(error);
            return null;
        }
    },

}

export default UsuarioApi