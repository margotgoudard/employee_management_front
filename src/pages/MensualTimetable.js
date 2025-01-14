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
import MensualTimetableSheet from "../services/MensualTimetableSheet";


const MensualTimetable = ({ user_id = null, user_id_timetable = null }) => {
  const user = useSelector((state) => state.auth.user);
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
    console.log("Fetching expense reports...", selectedTimetable.id_timetable);
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
      console.log("Compliance check result: ", result);
      setComplianceCheckResult(result);
    } catch (error) {   
      console.error("Error fetching compliance check result:", error);
    }
  };


  // useEffect(() => {
  //   if (selectedTimetable && selectedTimetable.year && selectedTimetable.month) {
  //     setSelectedDate(new Date(selectedTimetable.year, selectedTimetable.month - 1, 1));
  //   }
  // }, [selectedTimetable]);
  
  useEffect(() => {
    const fetchTimetableData = async () => {
      try {
        let selected;

        if (id_timetable) {
          // Get timetable by id_timetable (from URL params)
          selected = timetables.find((t) => t.id_timetable === parseInt(id_timetable));
        }

        if (user_id_timetable) {
          // Fetch timetable for the user
          const timetablesUser = await MensualTimetableSheet.fetchMensualTimetablesByUser(user_id);
          // Fetch les timetables du user selectionné
          selected = timetablesUser.find((t) => t.id_timetable === user_id_timetable);
        }

        if (selected) {
          dispatch(setSelectedTimetable(selected));
          setIsDisabled(selected.status !== "À compléter");
          console.log("Selected timetable: ", selected);
          const dailyTimetables = await DailyTimetableSheetService.fetchDailyTimetableByMensualTimetable(
            selected.id_timetable
          );
          dispatch(updateDailyTimetables(dailyTimetables));
  
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données :", err);
      }
    };

    fetchTimetableData();
  }, [timetables,user_id, user_id_timetable]);
  
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
      console.log("Compliance check! ");
      fetchComplianceCheckResult();
    }
  }, [selectedTimetable?.id_timetable]);

  // Rafraîchir les rapports de dépenses à chaque sélection de tableau de bord quotidien
  //useEffect(() => {
  //  if (selectedTimetable) {
  //    fetchExpenseReports();
  //  }
  //}, [selectedDailyTimetable]);

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

  return (
    <div className="mensual-timetable">
      <div className="content-layout">
        <div className="timetable-layout">
          <div className="main-section">
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
