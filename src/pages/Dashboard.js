import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import Department from '../services/Department';
import ExpenseReport from '../services/ExpenseReport';
import ComplianceCheck from '../services/ComplianceCheck'; 
import '../assets/styles/Dashboard.css';
import MensualTimetableSheet from '../services/MensualTimetableSheet';
import { GoAlertFill } from 'react-icons/go';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchDepartment, setSearchDepartment] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); 
  const [departments, setDepartments] = useState([]);
  const [statusCounts, setStatusCounts] = useState({}); 
  
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate(); 

  const STATUSES = ["Acceptée", "En attente d'approbation", "À compléter"];

  useEffect(() => {
    if (!user?.id_user) return;

    const fetchAllTimetables = async () => {
      try {
        const fetchedSubordinates = await Department.fetchAllSubordinatesByManager(user?.id_user);
        const enrichedData = await Promise.all(
          fetchedSubordinates.map(async (sub) => {
            const timetables = await MensualTimetableSheet.fetchMensualTimetablesByUser(sub.user?.id_user);

            const selectedYear = parseInt(selectedMonth.split('-')[0], 10);
            const selectedMonthNumber = parseInt(selectedMonth.split('-')[1], 10);

            const filteredTimetable = timetables.find(t => 
              t.year === selectedYear && t.month === selectedMonthNumber
            );

            if (!filteredTimetable) {
              return {
                ...sub,
                totalHours: 'N/A',
                totalExpenses: 'N/A',
                timetableStatus: 'Non disponible',
                hasErrors: false, 
              };
            }

            const totalHours = await MensualTimetableSheet.getMensualWorkedHours(filteredTimetable.id_timetable);
            const expenseReports = await ExpenseReport.getExpenseReportsByMensualTimetable(filteredTimetable.id_timetable);
            const totalExpenses = expenseReports.reduce((sum, report) => sum + report.amount, 0);

            const complianceErrors = await ComplianceCheck.fetchMensualComplianceCheck(filteredTimetable.id_timetable);
            console.log(complianceErrors.length)
            const firstKey = Object.keys(complianceErrors)[0];
            const errorsArray = complianceErrors[firstKey];
            return {
              ...sub,
              totalHours: totalHours.toFixed(2),
              totalExpenses: totalExpenses.toFixed(2),
              timetableStatus: filteredTimetable.status,
              commission: filteredTimetable.commission,
              hasErrors: errorsArray?.length > 0 || false, 
            };
          })
        );

        setData(enrichedData);
        setFilteredData(enrichedData);

        const uniqueDepartments = [
          ...new Set(enrichedData.map((sub) => sub.user.department.name))
        ];
        setDepartments(uniqueDepartments);

        const counts = enrichedData.reduce((acc, sub) => {
          const status = sub.timetableStatus || 'Non disponible';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const allStatusCounts = STATUSES.reduce((acc, status) => {
          acc[status] = counts[status] || 0;
          return acc;
        }, {});
        
        setStatusCounts(allStatusCounts);

      } catch (err) {
        console.error('Erreur lors de la récupération des fiches horaires :', err);
      }
    };

    fetchAllTimetables();
  }, [user?.id_user, selectedMonth]);

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
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {`${status} (${statusCounts[status] || 0})`}
            </option>
          ))}
        </select>

        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <div className="dashboard-table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Employé</th>
              <th>Heures totales (mois sélectionné)</th>
              <th>Département</th>
              <th>Notes de frais (mois sélectionné)</th>
              <th>Commission (mois sélectionné)</th>
              <th>Fiche horaire (mois sélectionné)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((sub) => (
              <tr
                key={sub.user?.id_user}
                onClick={() => handleRowClick(sub.user?.id_user)} 
                style={{ cursor: 'pointer' }} 
              >
                <td>{`${sub.user.first_name} ${sub.user.last_name}`}</td>
                <td>{sub.totalHours}</td>
                <td>{sub.user.department.name}</td>
                <td>{sub.totalExpenses}</td>
                <td>{sub.commission != null ? sub.commission : 0.00}</td>
                <td>
                  {sub.timetableStatus}
                  {sub.hasErrors && (
                    <span className="warning-icon" title="Cette fiche contient des erreurs">
                      <GoAlertFill size={18}/>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
