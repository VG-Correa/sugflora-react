import api from "./api"


const GeneroApi = {

    async getByFamilia(familia_id) {
        try {
            const response = await api.get('genero/familia/' + familia_id)
            return response
        }catch (error) {
            throw error
        }
    },

    async getAll() {
        try {

            const response = api.get('familia')
            return response
        } catch (error) {
            throw error
        }
    }
}

export default GeneroApi