import API from "./API";

class Document {

    static async fetchDocumentsByIdUser(id_user) {
        try {
            const endpoint = `/documents/${id_user}`;
            const response = await API.get(endpoint);
            return response; 
        } catch (error) {
            console.error("Erreur lors de la récupération des documents", error);
        }
    }
}

export default Document;
