import React, { useState } from 'react';
import '../assets/styles/CreateDepartmentForm.css';
import { LuCircleMinus, LuCirclePlus } from "react-icons/lu";

const CreateDepartmentForm = ({ departments, users, onSubmit, onCancel }) => {
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    id_sup_department: '',
    id_company: '',
  });

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewDepartment((prev) => ({ ...prev, [name]: value }));

    if (value.trim() === '') {
      setErrors((prev) => ({ ...prev, [name]: 'Ce champ est obligatoire' }));
    } else {
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUserSelect = (user) => {
    if (!selectedUsers.some((u) => u.user.id_user === user.user.id_user)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleUserRemove = (userId) => {
    setSelectedUsers(selectedUsers?.filter((user) => user.user.id_user !== userId));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!newDepartment.name.trim()) {
      newErrors.name = 'Ce champ est obligatoire';
    }
    if (selectedUsers.length === 0) {
      newErrors.users = 'Veuillez sélectionner au moins un utilisateur';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      onSubmit(newDepartment, selectedUsers);
    }
  };

  const filteredUsers = users?.filter((user) =>
    `${user.user.first_name} ${user.user.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="create-department-modal">
      <button className="close-button" onClick={onCancel}>
        -
      </button>
      <h3>Créer un nouveau département</h3>
      <form onSubmit={handleFormSubmit} className="create-department-form">
        <div className="form-group">
          <label>Nom du département</label>
          <input
            type="text"
            name="name"
            value={newDepartment.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Département parent</label>
          <select
            name="id_sup_department"
            value={newDepartment.id_sup_department}
            onChange={handleChange}
          >
            <option value="">Sélectionner un département parent</option>
            {departments.map((dept) => (
              <option key={dept.id_department} value={dept.id_department}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Rechercher des utilisateurs à ajouter</label>
          <input
            type="text"
            placeholder="Rechercher par nom"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <ul className="user-search-results">
            {filteredUsers?.map((user) => (
              <li key={user.id_user}>
                {user.user.first_name} {user.user.last_name}{' '}
                <button
                  type="button"
                  onClick={() => handleUserSelect(user)}
                >
                  <LuCirclePlus/>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="form-group">
          <label>Utilisateurs sélectionnés</label>
          <ul className="selected-users">
            {selectedUsers.map((user) => (
              <li key={user.id_user}>
                {user.user.first_name} {user.user.last_name}{' '}
                <button
                  type="button"
                  onClick={() => handleUserRemove(user.id_user)}
                >
                  <LuCircleMinus/>
                </button>
              </li>
            ))}
          </ul>
          {errors.users && <span className="error">{errors.users}</span>}
        </div>

        <div className="form-buttons">
          <button type="submit">Créer</button>
        </div>
      </form>
    </div>
  );
};

export default CreateDepartmentForm;
