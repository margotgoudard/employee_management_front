import React from 'react';
import '../assets/styles/Profile.css';

const UserInfo = ({ user }) => {
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
    </div>
  );
};

export default UserInfo;
