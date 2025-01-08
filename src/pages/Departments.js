import React, { useState, useEffect } from 'react';
import '../assets/styles/Department.css';
import { useSelector } from 'react-redux';
import Department from '../services/Department';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const user = useSelector((state) => state.auth.user); 

  useEffect(() => {
    const fetchDepartmentsRecursively = async (departmentId, collectedDepartments) => {
      try {
        const dept = await Department.fetchDepartmentById(departmentId);
        if (dept && !collectedDepartments.some(d => d.id_department === dept.id_department)) {
          collectedDepartments.push(dept);

          if (dept.id_sup_department) {
            // Récursion : récupérer le département parent
            await fetchDepartmentsRecursively(dept.id_sup_department, collectedDepartments);
          }
        }
      } catch (err) {
        console.error(`Erreur lors de la récupération du département ${departmentId} :`, err);
      }
    };

    const fetchData = async () => {
      try {
        // Récupération des départements et utilisateurs sous la responsabilité du manager
        const fetchedDepartments = await Department.fetchDepartmentByUserId(user.id_user);
        const fetchedUsers = await Department.fetchAllSubordinatesByManager(user.id_user);

        // Ajout des départements des utilisateurs
        const userDepartments = fetchedUsers.map((u) => u.id_department);
        const uniqueUserDepartments = [...new Set(userDepartments)];

        let allDepartments = [...fetchedDepartments];

        // Récupération récursive des départements parents
        for (const deptId of uniqueUserDepartments) {
          await fetchDepartmentsRecursively(deptId, allDepartments);
        }

        // Supprimer les doublons
        allDepartments = [...new Map(allDepartments.map(dept => [dept.id_department, dept])).values()];

        setDepartments(allDepartments);
        setUsers(fetchedUsers);
      } catch (err) {
        console.error('Erreur lors de la récupération des départements et des utilisateurs :', err);
      }
    };

    fetchData();
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
