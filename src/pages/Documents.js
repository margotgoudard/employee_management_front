import React, { useState, useEffect } from 'react';
import DocumentCategoryService from '../services/DocumentCategory';
import DocumentService from '../services/Document';
import '../assets/styles/Document.css';
import { useSelector } from 'react-redux';

const Documents = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchDocumentsAndCategories = async () => {
      try {
        const allDocuments = await DocumentService.fetchDocumentsByIdUser(user.id_user);
        console.log(allDocuments);
        setDocuments(allDocuments);
        setFilteredDocuments(allDocuments);

        const uniqueCategoryIds = [
          ...new Set(allDocuments.map((doc) => doc.id_document_category))
        ];

        const categoriesData = await Promise.all(
          uniqueCategoryIds.map((id) => DocumentCategoryService.fetchDocumentCategoryById(id))
        );

        setCategories(categoriesData);
        setSelectedCategory(categoriesData[0]?.id_document_category);
      } catch (err) {
        console.error('Erreur lors de la récupération des documents ou des catégories :', err);
      }
    };

    fetchDocumentsAndCategories();
  }, [user.id_user]);

  useEffect(() => {
    if (selectedCategory === null) {
      setFilteredDocuments(documents);
    } else {
      const filtered = documents?.filter((doc) => doc.id_document_category === selectedCategory);
      setFilteredDocuments(filtered);
    }
  }, [selectedCategory, documents]);

  useEffect(() => {
    const filtered = documents.filter((doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDocuments(filtered);
  }, [searchTerm, documents]);

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    const dateA = new Date(a.updated_at);
    const dateB = new Date(b.updated_at);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="documents-page">
      <div className="sidebar">
        <h3>Catégories</h3>
        <ul>
          {categories.map((category) => (
            <li
              key={category.id_document_category}
              className={selectedCategory === category.id_document_category ? 'active' : ''}
              onClick={() => setSelectedCategory(category.id_document_category)}
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
          {sortedDocuments.map((doc) => (
            <div key={doc.id_document} className="document-card">
              {doc.type === 'pdf' ? (
                <iframe src={doc.url} title={doc.name} className="document-preview"></iframe>
              ) : (
                <img src={doc.url} alt={doc.name} className="document-preview" />
              )}
              <div className="document-info">
                <h4>{doc.name}</h4>
                <p>Mis à jour : {new Date(doc.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Documents;
