import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Mensual_Timetable_Sheet_Service from "../services/Mensual_Timetable_Sheet";
import Daily_Timetable_Sheet from "../components/Daily_Timetable_Sheet";
import "../assets/styles/Mensual_Timetable.css";
import Monthly_Details from "../components/Monthly_Details";
import CalendarComponent from "../components/Calendar";
import Expense_Report_Details from "../components/Expense_Report_Details";
import Daily_Timetable_Sheet_Service from "../services/Daily_Timetable_Sheet";

const Mensual_Timetable = () => {
  const user = useSelector((state) => state.auth.user);
  const { id_timetable } = useParams();
  const [timetableData, setTimetableData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimetable, setSelectedTimetable] = useState({
    daily_timetable_sheets: [],
  });
  const [showExpenseDetails, setShowExpenseDetails] = useState(false); 
  const [showDailyDetails, setShowDailyDetails] = useState(false); 
  const [selectedDailyTimetable, setSelectedDailyTimetable] = useState(null);

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
        const data = await Mensual_Timetable_Sheet_Service.fetchMensualTimetablesByUser(
          user.id_user
        );
        setTimetableData(data || []);

        if (data && data.length > 0) {
          let selected = data.find((t) => t.id_timetable === parseInt(id_timetable));
          if (!selected) {
            selected = data[data.length - 1];
          }
          setSelectedTimetable(selected);
          setSelectedDate(new Date(selected.year, selected.month - 1, 1));
        }
      } catch (err) {
        console.error("Error fetching timetable data:", err);
      }
    };

    fetchTimetableData();
  }, [user.id_user, id_timetable]);

  useEffect(() => {
    if (!selectedTimetable || !selectedTimetable.id_timetable) {
      return;
    }

    const fetchAndCalculateData = async () => {
      try {
        const dailyTimetables = await Daily_Timetable_Sheet_Service.fetchDailyTimetableByMensualTimetable(
          selectedTimetable.id_timetable
        );
        setSelectedTimetable((prev) => ({
          ...prev,
          daily_timetable_sheets: dailyTimetables,
        }));
      } catch (error) {
        console.error("Error fetching or calculating timetable data:", error);
      }
    };

    fetchAndCalculateData();
  }, [selectedTimetable.id_timetable]);

  const handleMonthChange = (increment) => {
    const currentIndex = timetableData.findIndex(
      (t) => t.id_timetable === selectedTimetable.id_timetable
    );
    const newIndex = currentIndex + increment;

    if (newIndex >= 0 && newIndex < timetableData.length) {
      const newTimetable = timetableData[newIndex];
      const newDate = new Date(newTimetable.year, newTimetable.month - 1, 1);

      setSelectedTimetable(newTimetable);
      setSelectedDate(newDate);
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
      setSelectedTimetable((prev) => ({
        ...prev,
        daily_timetable_sheets: prev.daily_timetable_sheets.map((d) =>
          d.id_daily_timetable === dailyTimetable.id_daily_timetable
            ? dailyTimetable 
            : d 
        ),
      }));
      setSelectedDailyTimetable(dailyTimetable)
    } catch (error) {
      console.error("Erreur lors de la mise à jour des plannings quotidiens :", error);
    }
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
            <Monthly_Details
              selectedTimetable={selectedTimetable}
              setSelectedTimetable={setSelectedTimetable}
              onToggleExpenseDetails={() => (
                setShowExpenseDetails(!showExpenseDetails),
                setShowDailyDetails(false),
                setSelectedDailyTimetable(null)
              )}
             />
          </div>
        </div>

        {showExpenseDetails && (
          <div className="expense-details-section">
            <Expense_Report_Details
              mensualTimetableId={selectedTimetable?.id_timetable}
            />
          </div>
        )}

        {showDailyDetails && selectedDailyTimetable && (
          <Daily_Timetable_Sheet
          dailyTimetable={{ 
            ...selectedDailyTimetable, 
            onUpdate: refreshDailyTimetable 
          }}
        />
        )}

      </div>
    </div>
  );
};

export default Mensual_Timetable;
