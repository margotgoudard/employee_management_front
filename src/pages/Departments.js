import React, { useState, useEffect } from 'react';
import '../assets/styles/Department.css';
import { useSelector } from 'react-redux';
import Department from '../services/Department';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [expandedUsers, setExpandedUsers] = useState({});
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchDepartmentsRecursively = async (departmentId, collectedDepartments) => {
      try {
        const dept = await Department.fetchDepartmentById(departmentId);
        if (dept && !collectedDepartments.some(d => d.id_department === dept.id_department)) {
          collectedDepartments.push(dept);

          if (dept.id_sup_department) {
            await fetchDepartmentsRecursively(dept.id_sup_department, collectedDepartments);
          }
        }
      } catch (err) {
        console.error(`Erreur lors de la récupération du département ${departmentId} :`, err);
      }
    };

    const fetchData = async () => {
      try {
        const fetchedDepartment = await Department.fetchDepartmentById(user.id_department);
        const fetchedUsers = await Department.fetchAllSubordinatesByManager(user.id_user);

        const currentUser = {
          user: {
            id_user: user.id_user,
            first_name: user.first_name,
            last_name: user.last_name,
            department: fetchedDepartment,
          },
        };

        const updatedUsers = [currentUser, ...fetchedUsers];

        const userDepartments = updatedUsers.map((u) => u.user.department?.id_department).filter(Boolean);
        const uniqueUserDepartments = [...new Set(userDepartments)];

        let allDepartments = fetchedDepartment ? [fetchedDepartment] : [];

        for (const deptId of uniqueUserDepartments) {
          await fetchDepartmentsRecursively(deptId, allDepartments);
        }

        allDepartments = [...new Map(allDepartments.map(dept => [dept.id_department, dept])).values()];

        setDepartments(allDepartments);
        setUsers(updatedUsers);
      } catch (err) {
        console.error('Erreur lors de la récupération des départements et des utilisateurs :', err);
      }
    };

    fetchData();
  }, [user.id_user]);

  const toggleUsers = (departmentId) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [departmentId]: !prev[departmentId],
    }));
  };

  const renderDepartmentHierarchy = (parentId = null) => {
    const filteredDepartments = departments.filter(
      (dept) => dept.id_sup_department === parentId
    );

    return (
      <ul>
        {filteredDepartments.map((dept) => (
          <li key={dept.id_department}>
            <div
            className="department-name"
            onClick={() => toggleUsers(dept.id_department)}
            style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
            }}
            >
            <span>{expandedUsers[dept.id_department] ? '-' : '+'}</span>
            <span>{dept.name}</span>
            </div>
            {expandedUsers[dept.id_department] && (
              <ul className="user-list">
                {users
                  .filter((user) => user.user.department.id_department === dept.id_department)
                  .map((user) => (
                    <li key={user.user.id_user} className="user-item">
                      {user.user.first_name} {user.user.last_name}
                    </li>
                  ))}
              </ul>
            )}
            {renderDepartmentHierarchy(dept.id_department)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="department-page">
      <div className="department-hierarchy">
      <h2>Départements et utilisateurs sous votre responsabilité</h2>
        {renderDepartmentHierarchy()}
      </div>
    </div>
  );
};

export default Departments;
