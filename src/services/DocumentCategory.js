import API from "./API";

class DocumentCategory {

    static async fetchDocumentCategoryById(id_document_category) {
        try {
            const endpoint = `/document-categories/${id_document_category}`;
            const response = await API.get(endpoint);
            return response; 
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories", error);
        }
    }
}

export default DocumentCategory;
