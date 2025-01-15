import React, { useState, useEffect } from 'react';
import DocumentCategoryService from '../services/DocumentCategory';
import DocumentService from '../services/Document';
import '../assets/styles/Document.css';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { LuCirclePlus } from 'react-icons/lu';
import { HiOutlineArrowCircleLeft } from "react-icons/hi";
import { HiOutlineArrowCircleRight } from "react-icons/hi";

const Documents = () => {
  const [categories, setCategories] = useState([{ id_category: 'all', name: 'Tout' }]);
  const [selectedCategory, setSelectedCategory] = useState('all'); 
  const [selectedUploadCategory, setSelectedUploadCategory] = useState('new');
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedFile, setSelectedFile] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false); 
  const [fileError, setFileError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [documentsPerRow, setDocumentsPerRow] = useState(1); 
  const rowsPerPage = 6;

  const user = useSelector((state) => state.auth.user);
  const { id_user } = useParams();

  useEffect(() => {
    if (!user?.id_user) return;

    const fetchDocumentsAndCategories = async () => {
      try {
        const allDocuments = await DocumentService.fetchDocumentsByIdUser(user?.id_user);
        setDocuments(allDocuments);
        setFilteredDocuments(allDocuments);
  
        const uniqueCategoryIds = [...new Set(allDocuments.map((doc) => doc?.id_document_category))];
        
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
  }, [user?.id_user]);
  
  useEffect(() => {
    if (!user?.id_user) return;

    if (selectedCategory === 'all') {
      setFilteredDocuments(documents); 
    } else {
      const filtered = documents?.filter((doc) => doc?.id_document_category === selectedCategory);
      setFilteredDocuments(filtered);
    }
  }, [selectedCategory, documents]);

  useEffect(() => {
    if (!user?.id_user) return;

    const categoryFiltered = selectedCategory === 'all'
      ? documents
      : documents.filter((doc) => doc?.id_document_category === selectedCategory);
  
    const filtered = categoryFiltered.filter((doc) =>
      doc?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    setFilteredDocuments(filtered);
  }, [searchTerm, selectedCategory, documents]);
  
  useEffect(() => {
    if (!user?.id_user) return;

    calculateDocumentsPerRow(); 
    window.addEventListener('resize', calculateDocumentsPerRow);
    return () => window.removeEventListener('resize', calculateDocumentsPerRow);
  }, []);
  
  const calculateDocumentsPerRow = () => {
    const containerWidth = document.querySelector('.documents-grid')?.offsetWidth || 0;
    const documentCardWidth = 220; 
    const perRow = Math.floor(containerWidth / documentCardWidth);
    setDocumentsPerRow(perRow > 0 ? perRow : 1);
  };
  
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    const dateA = new Date(a.updatedAt);
    const dateB = new Date(b.updatedAt);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const handleUploadDocument = async () => {
    setFileError(false);  
    setCategoryError(false); 

    if (!selectedFile) {
      setFileError(true);
      return;
    }

    if (selectedUploadCategory === 'new' && !newCategoryName.trim()) {
      setCategoryError(true);
      return;
    }

    if (selectedFile.type !== 'application/pdf') {
      alert('Veuillez sélectionner uniquement un document PDF');
      return;
    }

    try {
      let categoryId = selectedUploadCategory;
      if (newCategoryName) {
        const newCategory = await DocumentCategoryService.createDocumentCategory({
          name: newCategoryName,
        });
        categoryId = newCategory.id_category;
        
        setCategories((prevCategories) => [...prevCategories, newCategory]); 
        setSelectedUploadCategory(newCategory.id_category);
      }
      

      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('document_name', selectedFile?.name);
      formData.append('id_document_category', categoryId);
      id_user && formData.append('id_user', id_user);

      const newDocument = await DocumentService.createDocument(formData);
      setDocuments((prevDocuments) => [...prevDocuments, newDocument]);
      setFilteredDocuments((prevDocuments) => {
        if (selectedCategory === 'all' || selectedCategory === categoryId) {
          return [...prevDocuments, newDocument];
        }
        return prevDocuments;
      });

      setSelectedFile(null);
      setNewCategoryName('');
      setSelectedUploadCategory(null);
      setIsUploadFormOpen(false);

    } catch (err) {
      console.error('Erreur lors du téléchargement du document :', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      alert('Seuls les fichiers PDF sont autorisés');
      setSelectedFile(null);
    } else {
      setSelectedFile(file);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedUploadCategory(e.target.value);
  };

  const handleNewCategoryChange = (e) => {
    setNewCategoryName(e.target.value);
  };

  const documentsPerPage = documentsPerRow * rowsPerPage;
  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = sortedDocuments.slice(indexOfFirstDocument, indexOfLastDocument);

  const totalPages = Math.max(1, Math.ceil(sortedDocuments.length / documentsPerPage));

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

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
              {category?.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <div className="header">
          <h2></h2>
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

        {id_user && Number(id_user) !== user?.id_user && !isUploadFormOpen && (
          <button
            type="button"
            onClick={() => setIsUploadFormOpen(true)}
            className="add-document-button"
          >
            Ajouter un document <LuCirclePlus />
          </button>
        )}

        {isUploadFormOpen && (
          <div className="upload-section">
            <h3>Ajouter un document</h3>
            <input type="file" onChange={handleFileChange} accept="application/pdf" />
            <select value={selectedUploadCategory} onChange={handleCategoryChange}>
              <option key="new-category" value="new">Créer une nouvelle catégorie</option>
              {categories
                .filter((category) => category.id_category !== 'all')
                .map((category) => (
                  <option key={category.id_category} value={category.id_category}>
                    {category?.name}
                  </option>
                ))}
            </select>

            {fileError && <p className="error-message">Veuillez sélectionner un fichier PDF</p>}
            {selectedUploadCategory === 'new' && (
              <>
                <input
                  type="text"
                  placeholder="Nom de la nouvelle catégorie"
                  value={newCategoryName}
                  onChange={handleNewCategoryChange}
                />
                {categoryError && <p className="error-message">Veuillez entrer un nom de catégorie</p>}
              </>
            )}
            <div className="upload-buttons">
              <button onClick={handleUploadDocument}>Télécharger</button>
              <button onClick={() => setIsUploadFormOpen(false)}>Annuler</button>
            </div>
          </div>
        )}

      {currentDocuments.length === 0 ? (
          <p style={{ color: 'gray', textAlign: 'center', marginTop: '20px' }}>
            Vous n'avez pas de document
          </p>
        ) : (
        <div className="documents-grid">
            {currentDocuments.map((doc) => {
              const fileExtension = doc?.name?.split('.').pop().toLowerCase() || '';
              const isPdf = fileExtension === 'pdf';
              const downloadUrl = `data:application/octet-stream;base64,${doc?.document}`;

              return (
                <div key={doc?.id_document} className="document-card">
                  <a href={downloadUrl} download={doc?.name} className="document-link">
                    {isPdf ? (
                      <iframe
                        src={`data:application/pdf;base64,${doc?.document}`}
                        title={doc?.name}
                        className="document-preview"
                      ></iframe>
                    ) : (
                      <div className="document-unavailable">
                        <p>Aperçu non disponible pour ce type de fichier</p>
                      </div>
                    )}
                  </a>
                  <div className="document-info">
                    <h4>{doc?.name}</h4>
                    <p>Mis à jour : {new Date(doc?.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
               );
              })}
            </div>
          )}

        <div className="pagination-buttons">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            <HiOutlineArrowCircleLeft size={30}/>
          </button>
          <span>
            {currentPage}/{totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            <HiOutlineArrowCircleRight size={30}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Documents;
