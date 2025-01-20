import React, { useState } from 'react';
import '../assets/styles/CreateDepartmentForm.css';
import CreateUserForm from './CreateUserForm';
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
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [temporaryUsers, setTemporaryUsers] = useState([]);
  const [usersToUpdate, setUsersToUpdate] = useState([]);

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
    if (name === 'id_sup_department') {
      const selectedDepartment = departments.find(
        (dept) => dept.id_department === Number(value)
      );
      if (selectedDepartment) {
        setNewDepartment((prev) => ({
          ...prev,
          id_company: selectedDepartment.id_company,
        }));
      } else {
        setNewDepartment((prev) => ({ ...prev, id_company: '' }));
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUserSelect = (user) => {
    if (!usersToUpdate.some((u) => u.user.id_user === user.user.id_user)) {
      setUsersToUpdate([...usersToUpdate, user]);
      setSelectedUsers([...selectedUsers, user]);
    }
  };  

  const handleUserRemove = (userId) => {
    setUsersToUpdate((prev) => prev.filter((user) => user.user.id_user !== userId));
    setTemporaryUsers((prev) => prev.filter((user) => user.user.id_user !== userId));
    setSelectedUsers((prev) => prev.filter((user) => user.user.id_user !== userId));
  };  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    const newErrors = {};
    if (!newDepartment.name.trim()) {
      newErrors.name = 'Ce champ est obligatoire';
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      onSubmit(newDepartment, usersToUpdate, temporaryUsers);
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      alert('Erreur lors de la création du département');
    }
  };
  
  const handleCreateUser = (newUser) => {
    const temporaryUser = { user: newUser };
    setTemporaryUsers((prev) => [...prev, temporaryUser]);
    setSelectedUsers((prev) => [...prev, temporaryUser]);
    setShowCreateUserModal(false);
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
              <li key={user.user.id_user}>
                {user.user.first_name} {user.user.last_name}{' '}
                <button
                  type="button"
                  onClick={() => handleUserSelect(user)}
                >
                  <LuCirclePlus />
                </button>
              </li>
            ))}
          </ul>
          {!showCreateUserModal && (
            <button
                type="button"
                onClick={() => setShowCreateUserModal(true)}
            >
                Créer un nouvel utilisateur <LuCirclePlus />
            </button>
            )}
        </div>

        <div className="form-group">
          <label>Utilisateurs sélectionnés</label>
          <ul className="selected-users">
            {selectedUsers.map((user) => (
              <li key={user.user.id_user}>
                {user.user.first_name} {user.user.last_name}{' '}
                <button
                  type="button"
                  onClick={() => handleUserRemove(user.user.id_user)}
                >
                  <LuCircleMinus />
                </button>
              </li>
            ))}
          </ul>
          {errors.users && <span className="error">{errors.users}</span>}
        </div>

        <div className="form-buttons">
            <button type="submit" disabled={showCreateUserModal}>
                Créer
            </button>
            </div>
      </form>

      {showCreateUserModal && (
        <div className="modal-overlay" onClick={() => setShowCreateUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <CreateUserForm
            idDepartment={newDepartment.id_department}
            departments={departments}
            onSubmit={handleCreateUser}
            onCancel={() => setShowCreateUserModal(false)}
            hideDepartmentSelection={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateDepartmentForm;
