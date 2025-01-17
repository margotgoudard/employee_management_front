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
  const [activeForm, setActiveForm] = useState(null); 

  const user = useSelector((state) => state.auth.user);
  const timetables = useSelector((state) => state.timetable.timetables); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id_user) return;

    const fetchDepartmentsRecursively = async (departmentId, collectedDepartments) => {
      try {
        const dept = await Department.fetchDepartmentById(departmentId);
        if (dept && !collectedDepartments.some((d) => d?.id_department === dept?.id_department)) {
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
        const fetchedDepartment = await Department.fetchDepartmentById(user?.id_department);
        const fetchedUsers = await Department.fetchAllSubordinatesByManager(user?.id_user);

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
  }, [user]);

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
      await User.createUser(newUser, user.id_user);
      const updatedUsers = await Department.fetchAllSubordinatesByManager(user.id_user); 
      setUsers(updatedUsers);
      setActiveForm(null); 
    } catch (err) {
      console.error('Erreur lors de la création de l’utilisateur :', err);
      alert('Erreur lors de la création de l’utilisateur');
    }
  };

  const handleCreateDepartment = async (newDepartment, selectedUsers, temporaryUsers) => {
    try {
      const createdDepartment = await Department.createDepartment(newDepartment);
  
      const departmentId = createdDepartment.id_department;
  
      for (const temporaryUser of temporaryUsers) {
        const userToCreate = { ...temporaryUser.user, id_department: departmentId };
        await User.createUser(userToCreate, user.id_user); 
      }
  
      for (const user of selectedUsers) {
        const updatedUser = { ...user.user, id_department: departmentId };
        await User.update(updatedUser);
      }
  
      setDepartments((prevDepartments) => [...prevDepartments, createdDepartment]);
      const updatedUsers = await Department.fetchAllSubordinatesByManager(user.id_user);
      setUsers(updatedUsers);
  
      setActiveForm(null);
    } catch (err) {
      console.error('Erreur lors de la création du département :', err);
      alert('Erreur lors de la création du département');
    }
  };
  

  const toggleForm = (formName) => {
    setActiveForm((prevForm) => (prevForm === formName ? null : formName));
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
                      style={{ cursor: 'pointer' }}
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
  
      <div className="button-container">
        <button onClick={() => toggleForm('user')}>
          <LuCirclePlus /> Créer un utilisateur dans un département existant
        </button>
        <button onClick={() => toggleForm('department')}>
          <LuCirclePlus /> Créer un département et de nouveaux utilisateurs
        </button>
      </div>

      {activeForm === 'user' && (      
        <CreateUserForm
          departments={departments}
          onSubmit={handleCreateUser}
          onCancel={() => setActiveForm(null)}
          hideDepartmentSelection={false}
        />
      )}

      {activeForm === 'department' && (
        <CreateDepartmentForm
          departments={departments}
          users={users}
          onSubmit={handleCreateDepartment}
          onCancel={() => setActiveForm(null)}
        />
      )}
    </div>
  );  
};

export default Departments;
