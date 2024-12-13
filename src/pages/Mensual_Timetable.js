import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Mensual_Timetable_Sheet from '../services/Mensual_Timetable_Sheet';
import Daily_Timetable_Sheet from '../services/Daily_Timetable_Sheet';
import '../assets/styles/Mensual_Timetable.css';
import MonthlyDetails from '../components/MonthlyDetails';
import CalendarComponent from '../components/Calendar';

const Mensual_Timetable = () => {
  const user = useSelector((state) => state.auth.user);
  const { id_timetable } = useParams();
  const [timetableData, setTimetableData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimetable, setSelectedTimetable] = useState({
    daily_timetable_sheets: [],
  });

  useEffect(() => {
    const fetchTimetableData = async () => {
      try {
        const data = await Mensual_Timetable_Sheet.fetchMensualTimetablesByUser(user.id_user);
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
        const dailyTimetables = await Daily_Timetable_Sheet.fetchDailyTimetableByMensualTimetable(
          selectedTimetable.id_timetable
        );
        console.log(dailyTimetables)
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

  return (
    <div className="mensual-timetable">
      <div className="timetable-container">
        <CalendarComponent
          selectedDate={selectedDate}
          selectedTimetable={selectedTimetable}
          onDateChange={handleDateChange}
          onMonthChange={handleMonthChange}
        />
        <MonthlyDetails 
          selectedTimetable={selectedTimetable}
          setSelectedTimetable={setSelectedTimetable} 
        />
      </div>
    </div>
  );
};

export default Mensual_Timetable;
