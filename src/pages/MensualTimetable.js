import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import DailyTimetableSheet from "../components/DailyTimetableSheet";
import "../assets/styles/MensualTimetable.css";
import MonthlyDetails from "../components/MonthlyDetails";
import CalendarComponent from "../components/Calendar";
import ExpenseReportDetails from "../components/ExpenseReportDetails";
import DailyTimetableSheetService from "../services/DailyTimetableSheet";
import ExpenseReport from "../services/ExpenseReport";
import Alert from "../components/Alert";
import {
  setSelectedTimetable,
  updateDailyTimetables,
} from "../redux/timetableSlice";
import ComplianceCheck from "../services/ComplianceCheck";
import { saveAs } from 'file-saver'; 
import { getISOWeek } from "date-fns";
import TimeSlot from "../services/TimeSlot";
import ExpenseReportService from "../services/ExpenseReport";
import { AiOutlineExport } from "react-icons/ai";

const MensualTimetable = () => {
  const timetables = useSelector((state) => state.timetable.timetables);
  const { id_timetable } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [showExpenseDetails, setShowExpenseDetails] = useState(false);
  const [expenseReports, setExpenseReports] = useState([]);
  const [showDailyDetails, setShowDailyDetails] = useState(false);
  const [selectedDailyTimetable, setSelectedDailyTimetable] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [complianceCheckResult, setComplianceCheckResult] = useState({});
  const [complianceCheckResultForDailyTimetable, setComplianceCheckResultForDailyTimetable] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const selectedTimetable = useSelector((state) => state.timetable.selectedTimetable);
  const dispatch = useDispatch();

  const handleDayClick = (day) => {
    const selectedDailyTimetable = selectedTimetable.daily_timetable_sheets.find(
      (d) => {
        const dayDate = new Date(d.day);
        return (
          dayDate.getDate() === day.getDate() &&
          dayDate.getMonth() === day.getMonth() &&
          dayDate.getFullYear() === day.getFullYear()
        );
      }
    );

    if (selectedDailyTimetable) {
      setSelectedDailyTimetable(selectedDailyTimetable);
      const complianceCheckResult = fetchComplianceCheckResultForDailyTimetable(selectedDailyTimetable);
      setComplianceCheckResultForDailyTimetable(complianceCheckResult);
      setShowExpenseDetails(false);
      setShowDailyDetails(true);
    } else {
      console.warn("No daily timetable found for this day.");
    }
  };

  const fetchExpenseReports = async () => {
    try {
      const data = await ExpenseReport.getExpenseReportsByMensualTimetable(
        selectedTimetable.id_timetable
      );

      const reportsWithDetails = await Promise.all(
        data.map(async (report) => {
          const dailyTimetable =
            await DailyTimetableSheetService.fetchDailyTimetableById(
              report.id_daily_timetable
            );

          return {
            ...report,
            dailyTimetable,
  
          };
        })
      );
 
      setExpenseReports(reportsWithDetails);
    } catch (error) {
      console.error("Error fetching expense reports:", error);
    }
  };


  const fetchComplianceCheckResult = async () => {
    try {
      const result = await ComplianceCheck.fetchComplianceCheckResult(selectedTimetable.id_timetable);
      setComplianceCheckResult(result);
    } catch (error) {   
      console.error("Error fetching compliance check result:", error);
    }
  };

  useEffect(() => {
    const fetchTimetableData = async () => {
      try {

        let selected;
  
        if (id_timetable) {
          selected = timetables.find((t) => t.id_timetable === parseInt(id_timetable));
  
          if (selected) {
            dispatch(setSelectedTimetable(selected));
            setIsDisabled(selected.status !== "À compléter");
            const dailyTimetables = await DailyTimetableSheetService.fetchDailyTimetableByMensualTimetable(
              selected.id_timetable
            );
            dispatch(updateDailyTimetables(dailyTimetables));
          }
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des données :', err);
      }
    };
  
    fetchTimetableData();
  }, [timetables]);
  
  useEffect(() => {
    if (!selectedTimetable || !selectedTimetable?.id_timetable) {
      return;
    }

    if (selectedTimetable && selectedTimetable.year && selectedTimetable.month) {
      setSelectedDate(new Date(selectedTimetable.year, selectedTimetable.month - 1, 1));
    }

    const fetchAndCalculateData = async () => {
      try {
        const dailyTimetables = await DailyTimetableSheetService.fetchDailyTimetableByMensualTimetable(
          selectedTimetable.id_timetable
        );
        dispatch(updateDailyTimetables(dailyTimetables));
      } catch (error) {
        console.error("Error fetching or calculating timetable data:", error);
      }
    };

    fetchAndCalculateData();
    fetchExpenseReports();
    if(selectedTimetable.status === "En attente d'approbation") {
      fetchComplianceCheckResult();
    }
  }, [selectedTimetable?.id_timetable]);


  const handleMonthChange = (increment) => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + increment, 1);
    setSelectedDate(newDate);
    setSelectedDailyTimetable(null);

    setShowDailyDetails(false);
    setShowExpenseDetails(false);

    const newTimetable = timetables.find(
      (t) => t.year === newDate.getFullYear() && t.month === newDate.getMonth() + 1
    );
  
    if (newTimetable) {
      dispatch(setSelectedTimetable(newTimetable));
  
      const fetchDailyTimetables = async () => {
        try {
          const dailyTimetables = await DailyTimetableSheetService.fetchDailyTimetableByMensualTimetable(
            newTimetable.id_timetable
          );
          dispatch(updateDailyTimetables(dailyTimetables));
          setIsDisabled(newTimetable.status !== "À compléter");
        } catch (error) {
          console.error("Erreur lors de la récupération des données journalières :", error);
        }
      };
  
      fetchDailyTimetables();
    }
  };

  const handleDateChange = (date) => {
    const isValid = selectedTimetable.daily_timetable_sheets.some(
      (d) => d.day === date.getDate()
    );
    if (isValid) {
      setSelectedDate(date);
    }
  };

  const refreshDailyTimetable = async (dailyTimetable) => {
    try {
      dispatch(updateDailyTimetables(
        selectedTimetable.daily_timetable_sheets.map((d) =>
          d.id_daily_timetable === dailyTimetable.id_daily_timetable
            ? dailyTimetable
            : d
        )
      ));
      fetchExpenseReports();
    } catch (error) {
      console.error("Erreur lors de la mise à jour des plannings quotidiens :", error);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });

    setTimeout(() => {
      setAlert({ message: "", type: "" });
    }, 3000);
  };

  const onSubmitSuccess = () => {
    showAlert("Votre fiche horaire a été soumise avec succès", "success")
    fetchComplianceCheckResult();
  }

  const fetchComplianceCheckResultForDailyTimetable = (dailyTimetable) => {
    if(complianceCheckResult) {
      if(complianceCheckResult[dailyTimetable.day]) {
         return complianceCheckResult[dailyTimetable.day];
      }
    } 
    return null;
  }

  const exportToCSV = async () => {
    if (!selectedTimetable || !selectedTimetable.daily_timetable_sheets) return;
  
    const csvRows = [];
    csvRows.push(`Mois;${selectedTimetable.month}/${selectedTimetable.year}\n`);
    csvRows.push("Jour;Début;Fin;Total heures jour;Total heures semaine;Total heures mois;Total notes de frais journée;Total commissions;Total notes de frais mensuel\n");
  
    let totalMonthlyHours = 0;
    let totalMonthlyExpenses = 0;
    let totalMonthlyCommissions = selectedTimetable.commission || 0;
    let weeklyHours = 0;
    let currentWeek = null;
  
    const sortedDailyTimetables = [...selectedTimetable.daily_timetable_sheets].sort((a, b) => {
      return new Date(a.day) - new Date(b.day);
    });
  
    for (const daySheet of sortedDailyTimetables) {
      const date = new Date(daySheet.day);
      const day = date.toLocaleDateString("fr-FR");
      const timeSlots = await TimeSlot.getTimeSlotsByDailyTimetable(daySheet.id_daily_timetable) || [];
      const expenses = await ExpenseReportService.getExpenseReportsByDailyTimetable(daySheet.id_daily_timetable) || [];
  
      const dayTotalHours = timeSlots.reduce((total, slot) => {
        const [startHour, startMinute, startSecond] = slot.start.split(":").map(Number);
        const [endHour, endMinute, endSecond] = slot.end.split(":").map(Number);
  
        const start = new Date();
        start.setHours(startHour, startMinute, startSecond, 0);
  
        const end = new Date();
        end.setHours(endHour, endMinute, endSecond, 0);
  
        const hours = (end - start) / (1000 * 60 * 60);
        return total + hours;
      }, 0);
  
      totalMonthlyHours += dayTotalHours;
      const weekNumber = getISOWeek(date);
      if (currentWeek !== weekNumber) {
        currentWeek = weekNumber;
        weeklyHours = 0;
      }
      weeklyHours += dayTotalHours;
  
      const expenseTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0) || 0;
      totalMonthlyExpenses += expenseTotal;
  
      if (timeSlots.length > 0) {
        timeSlots.forEach((slot) => {
          csvRows.push(`${day};${slot.start};${slot.end};${dayTotalHours.toFixed(2)};${weeklyHours.toFixed(2)};${totalMonthlyHours.toFixed(2)};${expenseTotal.toFixed(2)};${totalMonthlyCommissions.toFixed(2)};${totalMonthlyExpenses.toFixed(2)}\n`);
        });
      } else {
        csvRows.push(`${day};;;0.00;${weeklyHours.toFixed(2)};${totalMonthlyHours.toFixed(2)};${expenseTotal.toFixed(2)};${totalMonthlyCommissions.toFixed(2)};${totalMonthlyExpenses.toFixed(2)}\n`);
      }
    }
  
    const csvContent = csvRows.join("");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `Mensual_Timetable_${selectedTimetable.month}_${selectedTimetable.year}.csv`);
  };  

  return (
    <div className="mensual-timetable">
      <div className="content-layout">
        <div className="timetable-layout">
          <div className="main-section">
          <button onClick={exportToCSV} className="export-button">
            <AiOutlineExport />
          </button>
            <CalendarComponent
              selectedDate={selectedDate}
              selectedTimetable={selectedTimetable}
              complianceCheckResult={complianceCheckResult}
              onDateChange={handleDateChange}
              onMonthChange={handleMonthChange}
              onDayClick={handleDayClick}
            />
            <MonthlyDetails
              selectedTimetable={selectedTimetable}
              expenseReports={expenseReports}
              setSelectedTimetable={(timetable) => dispatch(setSelectedTimetable(timetable))}
              isDisabled={isDisabled}
              onToggleExpenseDetails={() => (
                setShowExpenseDetails(!showExpenseDetails),
                setShowDailyDetails(false),
                setSelectedDailyTimetable(null),
                setComplianceCheckResultForDailyTimetable(null)
              )}
              onSubmitSuccess={onSubmitSuccess}
            />
          </div>
        </div>

        {showExpenseDetails && (
          <div className="expense-details-section">
            <ExpenseReportDetails
              expenseReports={expenseReports}
              mensualTimetableId={selectedTimetable?.id_timetable}
            />
          </div>
        )}

        {showDailyDetails && selectedDailyTimetable && (
          <DailyTimetableSheet
            dailyTimetable={{
              ...selectedDailyTimetable
            }}
            complianceCheckResult={complianceCheckResultForDailyTimetable}
            isDisabled={isDisabled}
            onTimetableUpdate={refreshDailyTimetable}
          />
        )}
      </div>

      {alert.message && (
        <Alert message={alert.message} type={alert.type} />
      )}
    </div>
  );
};

export default MensualTimetable;
