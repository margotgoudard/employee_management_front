import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/Department.css';
import { useSelector } from 'react-redux';
import Department from '../services/Department';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const user = useSelector((state) => state.auth.user); 

  useEffect(() => {
    const fetchDepartmentsAndUsers = async () => {
      try {
        const response = await Department.fetchDepartmentByUserId(user.id_user);
        setDepartments(response.data.departments);
        setUsers(response.data.users);
      } catch (err) {
        console.error('Erreur lors de la récupération des départements et des utilisateurs :', err);
      }
    };

    fetchDepartmentsAndUsers();
  }, [user.id_user]);

  const renderDepartmentHierarchy = (parentId = null) => {
    const filteredDepartments = departments.filter(
      (dept) => dept.id_sup_department === parentId
    );

    return (
      <ul>
        {filteredDepartments.map((dept) => (
          <li key={dept.id_department}>
            <div className="department-name">{dept.name}</div>
            <ul className="user-list">
              {users
                .filter((user) => user.id_department === dept.id_department)
                .map((user) => (
                  <li key={user.id_user} className="user-item">
                    {user.name} ({user.email})
                  </li>
                ))}
            </ul>
            {renderDepartmentHierarchy(dept.id_department)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="department-page">
      <h2>Départements et utilisateurs sous la responsabilité de {user.name}</h2>
      <div className="department-hierarchy">
        {renderDepartmentHierarchy()}
      </div>
    </div>
  );
};

export default Departments;
