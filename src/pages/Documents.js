import React, { useState, useEffect } from 'react';
import DocumentCategoryService from '../services/DocumentCategory';
import DocumentService from '../services/Document';
import '../assets/styles/Document.css';
import { useSelector } from 'react-redux';

const Documents = () => {
  const [categories, setCategories] = useState([{ id_category: 'all', name: 'Tout' }]);
  const [selectedCategory, setSelectedCategory] = useState('all'); 
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchDocumentsAndCategories = async () => {
      try {
        const allDocuments = await DocumentService.fetchDocumentsByIdUser(user.id_user);
        setDocuments(allDocuments);
        setFilteredDocuments(allDocuments);
  
        const uniqueCategoryIds = [...new Set(allDocuments.map((doc) => doc.id_document_category))];
        
        const categoriesData = [];
        for (const id of uniqueCategoryIds) {
          const category = await DocumentCategoryService.fetchDocumentCategoryById(id);
          categoriesData.push(category);
        }
  
        setCategories((prevCategories) => {
            const allCategories = [...prevCategories, ...categoriesData];
            const uniqueCategories = allCategories.filter(
              (cat, index, self) =>
                index === self.findIndex((c) => c.id_category === cat.id_category)
            );
            return uniqueCategories;
          });

        } catch (err) {
        console.error('Erreur lors de la récupération des documents ou des catégories :', err);
      }
    };
  
    fetchDocumentsAndCategories();
  }, [user.id_user]);
  
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredDocuments(documents); 
    } else {
      const filtered = documents?.filter((doc) => doc.id_document_category === selectedCategory);
      setFilteredDocuments(filtered);
    }
  }, [selectedCategory, documents]);

  useEffect(() => {
    const categoryFiltered = selectedCategory === 'all'
      ? documents
      : documents.filter((doc) => doc.id_document_category === selectedCategory);
  
    const filtered = categoryFiltered.filter((doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    setFilteredDocuments(filtered);
  }, [searchTerm, selectedCategory, documents]);
  

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    const dateA = new Date(a.updatedAt);
    const dateB = new Date(b.updatedAt);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="documents-page">
      <div className="sidebar">
        <ul>
          {categories.map((category) => (
            <li
              key={category.id_category}
              className={selectedCategory === category.id_category ? 'active' : ''}
              onClick={() => setSelectedCategory(category.id_category)}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <div className="header">
          <h2>Mes fiches de paie</h2>
          <div className="filters">
            <button onClick={() => setSortOrder('asc')} className={sortOrder === 'asc' ? 'active' : ''}>
              Par date croissante
            </button>
            <button onClick={() => setSortOrder('desc')} className={sortOrder === 'desc' ? 'active' : ''}>
              Par date décroissante
            </button>
            <input
              type="text"
              placeholder="Rechercher"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="documents-grid">
        {sortedDocuments.map((doc) => {
            const fileExtension = doc.name.split('.').pop().toLowerCase();

            const isImage = ['png', 'jpg', 'jpeg'].includes(fileExtension);
            const isPdf = fileExtension === 'pdf';
            const isHtml = fileExtension === 'html';
            
            const downloadUrl = `data:application/octet-stream;base64,${doc.document}`;

            return (
            <div key={doc.id_document} className="document-card">
                <a href={downloadUrl} download={doc.name} className="document-link">
                {isImage && (
                    <img
                    src={`data:image/${fileExtension};base64,${doc.document}`}
                    alt={doc.name}
                    className="document-preview"
                    />
                )}
                {isPdf && (
                    <iframe
                    src={`data:application/pdf;base64,${doc.document}`}
                    title={doc.name}
                    className="document-preview"
                    ></iframe>
                )}
                {isHtml && (
                    <iframe
                    srcDoc={atob(doc.document)}
                    title={doc.name}
                    className="document-preview"
                    ></iframe>
                )}
                {!isImage && !isPdf && !isHtml && (
                    <div className="document-unavailable">
                    <p>Aperçu non disponible pour ce type de fichier</p>
                    </div>
                )}
                </a>
                <div className="document-info">
                <h4>{doc.name}</h4>
                <p>Mis à jour : {new Date(doc.updatedAt).toLocaleDateString()}</p>
                </div>
            </div>
            );
        })}
        </div>
      </div>
    </div>
  );
};

export default Documents;
