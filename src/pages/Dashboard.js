import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import Department from '../services/Department';
import ExpenseReport from '../services/ExpenseReport';
import '../assets/styles/Dashboard.css';
import MensualTimetableSheet from '../services/MensualTimetableSheet';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchDepartment, setSearchDepartment] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [departments, setDepartments] = useState([]);
  
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchSubordinates = async () => {
      try {
        const fetchedSubordinates = await Department.fetchAllSubordinatesByManager(user.id_user);
        const enrichedData = await Promise.all(
          fetchedSubordinates.map(async (sub) => {
            const lastTimetable = await MensualTimetableSheet.getLastMensualTimetable(sub.user.id_user);
  
            if (!lastTimetable) {
              return {
                ...sub,
                totalHours: 'N/A',
                totalExpenses: 'N/A',
                timetableStatus: 'Non disponible',
              };
            }
  
            const totalHours = await MensualTimetableSheet.getMensualWorkedHours(lastTimetable.id_timetable);
            const expenseReports = await ExpenseReport.getExpenseReportsByMensualTimetable(lastTimetable.id_timetable);
            const totalExpenses = expenseReports.reduce((sum, report) => sum + report.amount, 0);
  
            return {
              ...sub,
              totalHours: totalHours.toFixed(2),
              totalExpenses: totalExpenses.toFixed(2),
              timetableStatus: lastTimetable.status,
              commission: lastTimetable.commission,
            };
          })
        );
  
        setData(enrichedData);
        setFilteredData(enrichedData);
  
        const uniqueDepartments = [
          ...new Set(enrichedData.map((sub) => sub.user.department.name))
        ];
        setDepartments(uniqueDepartments);
      } catch (err) {
        console.error('Erreur lors de la récupération des subordonnés :', err);
      }
    };
  
    fetchSubordinates();
  }, [user.id_user]);
  
  useEffect(() => {
    const applyFilters = () => {
      const lowerSearchName = searchName.toLowerCase();

      const filtered = data.filter((sub) => {
        const matchesName = `${sub.user.first_name} ${sub.user.last_name}`
          .toLowerCase()
          .includes(lowerSearchName);
        
        const matchesDepartment = searchDepartment
          ? sub.user.department.name === searchDepartment
          : true;
        
        const matchesStatus = searchStatus
          ? sub.timetableStatus === searchStatus
          : true;
        
        return matchesName && matchesDepartment && matchesStatus;
      });

      setFilteredData(filtered);
    };

    applyFilters();
  }, [searchName, searchDepartment, searchStatus, data]);

  const handleRowClick = (id_user) => {
    navigate(`/employee-profile/${id_user}`);
  };

  return (
    <div className="dashboard-page">
      <h2>Tableau des subordonnés</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />

        <select
        value={searchDepartment}
        onChange={(e) => setSearchDepartment(e.target.value)}
        >
        <option value="">Tous les départements</option>
        {departments.map((dept, index) => (
            <option key={index} value={dept}>
            {dept}
            </option>
        ))}
        </select>

        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          <option value="Acceptée">Acceptée</option>
          <option value="En attente d'approbation">En attente</option>
          <option value="À compléter">À compléter</option>
        </select>
      </div>

      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Employé</th>
            <th>Heures totales (mois en cours)</th>
            <th>Département</th>
            <th>Notes de frais (mois en cours)</th>
            <th>Commission (mois en cours)</th>
            <th>Fiche horaire (mois en cours)</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((sub) => (
            <tr
              key={sub.user.id_user}
              onClick={() => handleRowClick(sub.user.id_user)} 
              style={{ cursor: 'pointer' }} 
            >
              <td>{`${sub.user.first_name} ${sub.user.last_name}`}</td>
              <td>{sub.totalHours}</td>
              <td>{sub.user.department.name}</td>
              <td>{sub.totalExpenses}</td>
              <td>{sub.commission != null ? sub.commission : 0.00}</td>
              <td>{sub.timetableStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
