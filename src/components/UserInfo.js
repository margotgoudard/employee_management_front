import React from 'react';
import { FaFileAlt } from 'react-icons/fa'; // Import de l'icône
import '../assets/styles/Profile.css';

import { useNavigate } from 'react-router-dom';

const UserInfo = ({ user, admin }) => {
  const navigate = useNavigate();


  const handleViewDoc = () => {
    navigate(`/documents`)
  }

  return (
    <div className="user-info">
      <h2>Informations personnelles</h2>
      <div className="info-item">
        <label>Nom</label>
        <input type="text" value={user?.last_name || ''} readOnly />
      </div>
      <div className="info-item">
        <label>Prénom</label>
        <input type="text" value={user?.first_name || ''} readOnly />
      </div>
      <div className="info-item">
        <label>Email</label>
        <input type="text" value={user?.mail || ''} readOnly />
      </div>
      <div className="info-item">
        <label>Tel</label>
        <input type="text" value={user?.phone || ''} readOnly />
      </div>
      <div className="info-item">
        <label>Profession</label>
        <input type="text" value={user?.role || ''} readOnly />
      </div>

      {admin && <button className="view-documents-button" onClick={() => handleViewDoc()}>
        <FaFileAlt className="file-icon" />
        Voir tous les documents
      </button>}
    </div>
  );
};

export default UserInfo;
