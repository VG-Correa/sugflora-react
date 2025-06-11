import api from "./api"


const EspecieApi = {

     async getByGenero(genero_id) {
        try {
            const response = await api.get('especie/genero/' + genero_id)
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

export default EspecieApi