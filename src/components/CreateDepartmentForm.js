import React, { useState } from 'react';
import '../assets/styles/CreateDepartmentForm.css';

const CreateDepartmentForm = ({ departments, onSubmit, onCancel }) => {
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    id_sup_department: '',
    id_company: '',
  });

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

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!newDepartment.name.trim()) {
      newErrors.name = 'Ce champ est obligatoire';
    }

    if (!newDepartment.id_sup_department) {
      newErrors.id_sup_department = 'Ce champ est obligatoire';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {

      onSubmit(newDepartment);
    }
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
            />
            {errors.name && <span className="error">Ce champ est obligatoire</span>}
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
            {errors.id_sup_department && (
              <span className="error">Ce champ est obligatoire</span>
            )}
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
