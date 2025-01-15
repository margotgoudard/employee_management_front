import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Department from '../services/Department';
import TimeSlot from '../services/TimeSlot';
import ExpenseReport from '../services/ExpenseReport';
import '../assets/styles/Dashboard.css';
import MensualTimetableSheet from '../services/MensualTimetableSheet';

const Dashboard = () => {
  const [data, setData] = useState([]); 
  const user = useSelector((state) => state.auth.user);

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
            console.log(totalHours)
            const expenseReports = await ExpenseReport.getExpenseReportsByMensualTimetable(lastTimetable.id_timetable);
            const totalExpenses = expenseReports.reduce((sum, report) => sum + report.amount, 0);

            return {
              ...sub,
              totalHours: totalHours.toFixed(2),
              totalExpenses: totalExpenses.toFixed(2),
              timetableStatus: lastTimetable.status,
              commission: lastTimetable.commission
            };
          })
        );

        setData(enrichedData);
      } catch (err) {
        console.error('Erreur lors de la récupération des subordonnés :', err);
      }
    };

    fetchSubordinates();
  }, [user.id_user]);

  return (
    <div className="dashboard-page">
      <h2>Tableau des subordonnés</h2>
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
          {data.map((sub) => (
            <tr key={sub.user.id_user}>
              <td>{`${sub.user.first_name} ${sub.user.last_name}`}</td>
              <td>{sub.totalHours}</td>
              <td>{sub.user.department.name}</td>
              <td>{sub.totalExpenses}</td>
              <td>{sub.commission != null ? sub.commission : 0}</td>
              <td>{sub.timetableStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
