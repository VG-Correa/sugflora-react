import api from "./api"


const loginApi = {
    async login(username, password) {
        try {
            const response = await api.post('auth/login', {username, password});
            // print(response)
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default loginApi;