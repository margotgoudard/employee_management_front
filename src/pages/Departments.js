import React, { useState, useEffect } from 'react';
import '../assets/styles/Department.css';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Department from '../services/Department';
import { setSelectedTimetable } from '../redux/timetableSlice';
import User from '../services/User';
import CreateUserForm from '../components/CreateUserForm';
import { LuCirclePlus } from "react-icons/lu";
import CreateDepartmentForm from '../components/CreateDepartmentForm';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [expandedUsers, setExpandedUsers] = useState({});
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateDepartmentModal, setShowCreateDepartmentModal] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const timetables = useSelector((state) => state.timetable.timetables); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartmentsRecursively = async (departmentId, collectedDepartments) => {
      try {
        const dept = await Department.fetchDepartmentById(departmentId);
        if (dept && !collectedDepartments.some((d) => d.id_department === dept.id_department)) {
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

        const userDepartments = updatedUsers
          .map((u) => u.user.department?.id_department)
          .filter(Boolean);
        const uniqueUserDepartments = [...new Set(userDepartments)];

        let allDepartments = fetchedDepartment ? [fetchedDepartment] : [];

        for (const deptId of uniqueUserDepartments) {
          await fetchDepartmentsRecursively(deptId, allDepartments);
        }

        allDepartments = [...new Map(allDepartments.map((dept) => [dept.id_department, dept])).values()];

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

  const handleUserClick = (clickedUserId) => {
    if (clickedUserId === user.id_user) {
      if (timetables && timetables.length > 0) {
        const currentDate = new Date();
        let selected = timetables.find(
          (t) =>
            t.year === currentDate.getFullYear() &&
            t.month === currentDate.getMonth() + 1
        );

        if (!selected) {
          selected = timetables[timetables.length - 1]; 
        }

        dispatch(setSelectedTimetable(selected));

        navigate(`/mensual_timetable/${selected.id_timetable}`);
      }
    } else {
      navigate(`/employee-profile/${clickedUserId}`);
    }
  };

  const handleCreateUser = async (newUser) => {
    try {
      await User.CreateUser(newUser, user.id_user);
      const updatedUsers = await Department.fetchAllSubordinatesByManager(user.id_user); 
      setUsers(updatedUsers);
      setShowCreateUserModal(false);
    } catch (err) {
      console.error('Erreur lors de la création de l’utilisateur :', err);
      alert('Erreur lors de la création de l’utilisateur');
    }
  };

  const handleCreateDepartment = async (newDepartment) => {
    try {
      const createdDepartment = await Department.createDepartment(newDepartment); 
      setDepartments((prevDepartments) => [...prevDepartments, createdDepartment]); 
      setShowCreateDepartmentModal(false);
    } catch (err) {
      console.error('Erreur lors de la création du département :', err);
      alert('Erreur lors de la création du département');
    }
  };
  
  const renderDepartmentHierarchy = (parentId = null) => {
    const filteredDepartments = departments.filter((dept) => dept.id_sup_department === parentId);

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
                    <li
                      key={user.user.id_user}
                      className="user-item"
                      onClick={() => handleUserClick(user.user.id_user)}
                      style={{ cursor: 'pointer'}}
                    >
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
  
      {!showCreateUserModal && (
        <div className="create-user-button-container">
          <button onClick={() => setShowCreateUserModal(true)}>
            <LuCirclePlus /> Créer un utilisateur
          </button>
        </div>
      )}

      {!showCreateDepartmentModal && (
        <div className="create-department-button-container">
          <button onClick={() => setShowCreateDepartmentModal(true)}>
            <LuCirclePlus /> Créer un département
          </button>
        </div>
      )}
  
      {showCreateUserModal && (
        <CreateUserForm
          departments={departments}
          onSubmit={handleCreateUser}
          onCancel={() => setShowCreateUserModal(false)}
        />
      )}

      {showCreateDepartmentModal && (
        <CreateDepartmentForm
          departments={departments}
          onSubmit={handleCreateDepartment}
          onCancel={() => setShowCreateDepartmentModal(false)}
        />
      )}
    </div>
  );  
  
};

export default Departments;
