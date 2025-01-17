import React, { useState, useEffect } from 'react';
import { FaFileAlt } from 'react-icons/fa'; 
import '../assets/styles/Profile.css';
import { useSelector } from 'react-redux';
import User from '../services/User';
import { useNavigate } from 'react-router-dom';

const UserInfo = ({ user, admin }) => {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false); 
  const [editedUser, setEditedUser] = useState({}); 
  const [isDisabled, setIsDisabled] = useState(true);
  const currentUser = useSelector((state) => state.auth.user);

  const handleViewDoc = () => {
    navigate(`/documents/${user.id_user}`)
  }

  useEffect(() => {
    if (currentUser?.is_admin || currentUser?.is_sup_admin) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }

    setEditedUser(user || {});
  }, [currentUser?.id_user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setEditedUser(user); 
    setIsEditMode(false); 
  };

  const handleSave = async () => {
    try {
      const response = User.update(editedUser);
      if(response){
        setIsEditMode(false); 
      }
    } catch (error) {
      console.error('Failed to update user profile:', error);
    }
  };

  return (
    <div className="user-info">
      <h2>Informations personnelles</h2>
      <div className="info-item">
        <label>Nom</label>
        <input
          type="text"
          name="last_name"
          value={editedUser?.last_name || ''}
          disabled={!isEditMode} 
          onChange={handleChange}
        />
      </div>
      <div className="info-item">
        <label>Prénom</label>
        <input
          type="text"
          name="first_name"
          value={editedUser?.first_name || ''}
          disabled={!isEditMode}
          onChange={handleChange}
        />
      </div>
      <div className="info-item">
        <label>Email</label>
        <input
          type="text"
          name="mail"
          value={editedUser?.mail || ''}
          disabled={!isEditMode}
          onChange={handleChange}
        />
      </div>
      <div className="info-item">
        <label>Tel</label>
        <input
          type="text"
          name="phone"
          value={editedUser?.phone || ''}
          disabled={!isEditMode}
          onChange={handleChange}
        />
      </div>
      <div className="info-item">
        <label>Profession</label>
        <input
          type="text"
          name="role"
          value={editedUser?.role || ''}
          disabled={!isEditMode}
          onChange={handleChange}
        />
      </div>

      {admin && 
        <div className="button-container">
          <button className="view-documents-button" onClick={() => handleViewDoc()}>
            <FaFileAlt className="file-icon" />
            Voir tous les documents
          </button>
        </div>
      }

      { !isDisabled &&
        <div className="button-container">
          {!isEditMode ? (
            <button
              className="save-button"
              onClick={() => setIsEditMode(true)} 
            >
              Modifier
            </button>
          ) : (
            <>
              <button className="save-button" onClick={handleSave}>
                Enregistrer
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                Annuler
              </button>
            </>
          )}
        </div>
        }
      </div>
  );
};

export default UserInfo;
