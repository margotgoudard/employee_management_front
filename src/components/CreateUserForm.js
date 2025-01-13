import React, { useState } from 'react';
import '../assets/styles/CreateUserForm.css';

const CreateUserForm = ({ departments, idDepartment, hideDepartmentSelection, onSubmit, onCancel }) => {
    const [newUser, setNewUser] = useState({
      first_name: '',
      last_name: '',
      role: '',
      mail: '',
      phone: '',
      num_address: '',
      street_address: '',
      city_address: '',
      area_code_address: '',
      region_address: '',
      country_address: '',
      id_department: idDepartment || '',
      password: generatePassword(),
      is_admin: false,
      is_sup_admin: false,
      is_activated: true,
      last_connected: null,
    });
  
    const [errors, setErrors] = useState({});
  
    const handleChange = (e) => {
      setNewUser({ ...newUser, [e.target.name]: e.target.value });
  
      if (e.target.value.trim() === '') {
        setErrors({ ...errors, [e.target.name]: 'Ce champ est obligatoire' });
      } else {
        const updatedErrors = { ...errors };
        delete updatedErrors[e.target.name];
        setErrors(updatedErrors);
      }
    };
  
    const handleFormSubmit = (e) => {
      e.preventDefault();
      const newErrors = {};
  
      Object.keys(newUser).forEach((key) => {
        if (
          key !== 'last_connected' &&
          key !== 'is_admin' &&
          key !== 'is_sup_admin' &&
          key !== 'id_department' && 
          !newUser[key]
        ) {
          newErrors[key] = 'Ce champ est obligatoire';
        }
      });
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      } else {
        onSubmit(newUser);
      }
    };
  
    return (
      <div className="modal">
        <div className="form-container">
          <button className="close-button" onClick={onCancel}>
            -
          </button>
          <h3>Créer un nouvel utilisateur</h3>
  
          <form onSubmit={handleFormSubmit} className="create-user-form">
            {[{ label: 'Prénom', name: 'first_name' }, { label: 'Nom', name: 'last_name' }, { label: 'Rôle', name: 'role' }, { label: 'Email', name: 'mail', type: 'email' }, { label: 'Téléphone', name: 'phone' }, { label: "Numéro d'adresse", name: 'num_address' }, { label: 'Rue', name: 'street_address' }, { label: 'Ville', name: 'city_address' }, { label: 'Code postal', name: 'area_code_address' }, { label: 'Région', name: 'region_address' }, { label: 'Pays', name: 'country_address' }].map((field) => (
              <div key={field.name} className="form-group">
                <label>{field.label}</label>
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={newUser[field.name]}
                  onChange={handleChange}
                />
                {errors[field.name] && (
                  <span className="error">{errors[field.name]}</span>
                )}
              </div>
            ))}
  
            {!hideDepartmentSelection && (
              <div className="form-group">
                <label>Département</label>
                <select
                  name="id_department"
                  value={newUser.id_department}
                  onChange={handleChange}
                  disabled={!!idDepartment}
                >
                  <option value="">Sélectionner un département</option>
                  {departments.map((dept) => (
                    <option key={dept.id_department} value={dept.id_department}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.id_department && (
                  <span className="error">{errors.id_department}</span>
                )}
              </div>
            )}
  
            <div className="form-group">
              <label>Mot de passe (généré automatiquement)</label>
              <input
                type="text"
                name="password"
                value={newUser.password}
                readOnly
              />
            </div>
  
            <div className="form-buttons">
              <button type="submit">Créer</button>
            </div>
          </form>
        </div>
      </div>
    );
  };  

function generatePassword() {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export default CreateUserForm;
