import API from "./API";

class Document {

    static async fetchDocumentsByIdUser(id_user) {
        try {
            const endpoint = `/documents/user/${id_user}`;
            const response = await API.get(endpoint);
            return response; 
        } catch (error) {
            console.error("Erreur lors de la récupération des documents", error);
        }
    }

    
    static async createDocument(document) {
        try {
            const endpoint = `/documents`;
            const response = await API.post(endpoint, document);
            return response.document;
        } catch (error) {
            console.error('Error adding document:', error);
            throw error;
        }
    }  
}

export default Document;
