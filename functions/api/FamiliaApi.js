import api from "./api"


const FamiliaApi = {
    async getAll() {
        try {

            const response = api.get('familia')
            return response
        } catch (error) {
            throw error
        }
    }
}

export default FamiliaApi