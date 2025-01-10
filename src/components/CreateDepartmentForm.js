import React, { useState } from 'react';
import '../assets/styles/CreateDepartmentForm.css';

const CreateDepartmentForm = ({ departments, onSubmit, onCancel }) => {
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    id_sup_department: null,
  });

  const handleChange = (e) => {
    setNewDepartment({ ...newDepartment, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newDepartment.name.trim()) {
      alert('Le nom du département est obligatoire');
      return;
    }
    onSubmit(newDepartment);
  };

  return (
    <div className="create-department-modal">
        <button className="close-button" onClick={onCancel}>
          -
        </button>
        <h3>Créer un nouveau département</h3>
        <form onSubmit={handleFormSubmit} className="create-department-form">
        <div className="form-row">
            <div className="form-group">
            <label>Nom du département</label>
            <input
                type="text"
                name="name"
                value={newDepartment.name}
                onChange={handleChange}
                required
            />
            </div>
            <div className="form-group">
            <label>Département parent</label>
            <select
                name="id_sup_department"
                value={newDepartment.id_sup_department || ''}
                onChange={handleChange}
            >
                <option value="">Aucun</option>
                {departments.map((dept) => (
                <option key={dept.id_department} value={dept.id_department}>
                    {dept.name}
                </option>
                ))}
            </select>
            </div>
        </div>
        <div className="form-buttons">
            <button type="submit">Créer</button>
        </div>
        </form>
    </div>
  );
};

export default CreateDepartmentForm;
