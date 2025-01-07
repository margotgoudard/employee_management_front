import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import MensualTimetableSheetService from "../services/MensualTimetableSheet";
import DailyTimetableSheet from "../components/DailyTimetableSheet";
import "../assets/styles/MensualTimetable.css";
import MonthlyDetails from "../components/MonthlyDetails";
import CalendarComponent from "../components/Calendar";
import ExpenseReportDetails from "../components/ExpenseReportDetails";
import DailyTimetableSheetService from "../services/DailyTimetableSheet";
import Notification from "../components/Notification";
import {
  setTimetables,
  setSelectedTimetable,
  updateDailyTimetables,
} from "../redux/timetableSlice";

const MensualTimetable = () => {
  const user = useSelector((state) => state.auth.user);
  const { id_timetable } = useParams();
  const [timetableData, setTimetableData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showExpenseDetails, setShowExpenseDetails] = useState(false);
  const [showDailyDetails, setShowDailyDetails] = useState(false);
  const [selectedDailyTimetable, setSelectedDailyTimetable] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });

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
      setShowExpenseDetails(false);
      setShowDailyDetails(true);
    } else {
      console.warn("No daily timetable found for this day.");
    }
  };

  useEffect(() => {
    const fetchTimetableData = async () => {
      try {
        const data = await MensualTimetableSheetService.fetchMensualTimetablesByUser(
          user.id_user
        );
        setTimetableData(data || []);

        if (data && data.length > 0) {
          let selected;
          
          if (id_timetable) {
            selected = data.find((t) => t.id_timetable === parseInt(id_timetable));
          }
  
          if (!selected) {
            const currentDate = new Date();
            selected = data.find(
              (t) =>
                t.year === currentDate.getFullYear() &&
                t.month === currentDate.getMonth() + 1
            ) || data[data.length - 1]; 
          }

          dispatch(setSelectedTimetable(selected));
          setSelectedDate(new Date(selected.year, selected.month - 1, 1));
        }
      } catch (err) {
        console.error("Error fetching timetable data:", err);
      }
    };

    fetchTimetableData();
  }, [user.id_user, id_timetable]);

  useEffect(() => {
    if (!selectedTimetable || !selectedTimetable?.id_timetable) {
      return;
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
  }, [selectedTimetable?.id_timetable]);

  const handleMonthChange = (increment) => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + increment, 1);
    setSelectedDate(newDate);
  
    const newTimetable = timetableData.find(
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
      setSelectedDailyTimetable(dailyTimetable);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des plannings quotidiens :", error);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000);
  };

  return (
    <div className="mensual-timetable">
      <div className="content-layout">
        <div className="timetable-layout">
          <div className="main-section">
            <CalendarComponent
              selectedDate={selectedDate}
              selectedTimetable={selectedTimetable}
              onDateChange={handleDateChange}
              onMonthChange={handleMonthChange}
              onDayClick={handleDayClick}
            />
            <MonthlyDetails
              selectedTimetable={selectedTimetable}
              setSelectedTimetable={(timetable) => dispatch(setSelectedTimetable(timetable))}
              onToggleExpenseDetails={() => (
                setShowExpenseDetails(!showExpenseDetails),
                setShowDailyDetails(false),
                setSelectedDailyTimetable(null)
              )}
              onSubmitSuccess={() => showNotification("Votre fiche horaire a été soumise avec succès", "success")}
            />
          </div>
        </div>

        {showExpenseDetails && (
          <div className="expense-details-section">
            <ExpenseReportDetails
              mensualTimetableId={selectedTimetable?.id_timetable}
            />
          </div>
        )}

        {showDailyDetails && selectedDailyTimetable && (
          <DailyTimetableSheet
            dailyTimetable={{
              ...selectedDailyTimetable,
              onUpdate: refreshDailyTimetable,
            }}
          />
        )}
      </div>

      {notification.message && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </div>
  );
};

export default MensualTimetable;
