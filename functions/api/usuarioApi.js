import api from "./api"


export default UsuarioApi = {

    async getUserByUsername(username) {
        try {
            const response = await api.get("usuario/username/" + username)
            return response;

        } catch (error) {
            console.log(error);
            return null;
        }
    }

}