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
  const [selectedTimetable, setSelectedTimetable] = useState([]);
  const [availableDates, setAvailablesDates] = useState([]);
  const [weeklyWorkedHours, setWeeklyWorkedHours] = useState([]);

  const frenchToEnglishMonths = {
    janvier: 'January',
    février: 'February',
    mars: 'March',
    avril: 'April',
    mai: 'May',
    juin: 'June',
    juillet: 'July',
    août: 'August',
    septembre: 'September',
    octobre: 'October',
    novembre: 'November',
    décembre: 'December',
  };

  useEffect(() => {
    const fetchTimetableData = async () => {
      try {
        const data = await Mensual_Timetable_Sheet.fetchMensualTimetable(user.id_user);
        setTimetableData(data || []);

        if (data && data.length > 0) {
          let selectedTimetable = data.find((t) => t.id_timetable === parseInt(id_timetable));
          if (!selectedTimetable) {
            selectedTimetable = data[data.length - 1];
          }

          const translatedMonth = frenchToEnglishMonths[selectedTimetable.month.toLowerCase()];
          if (!translatedMonth) {
            throw new Error(`Mois inconnu : ${selectedTimetable.month}`);
          }

          const selectedDate = new Date(
            `${selectedTimetable.year}-${new Intl.DateTimeFormat('en-US', { month: '2-digit' }).format(
              new Date(Date.parse(`${translatedMonth} 1`))
            )}-01`
          );

          const availableDates = [];
          const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
          const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

          for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
            availableDates.push(new Date(d));
          }

          setAvailablesDates(availableDates);
          setSelectedTimetable(selectedTimetable);
          setSelectedDate(selectedDate);
        }
      } catch (err) {
        console.error("Error fetching timetable data:", err);
      }
    };
    fetchTimetableData();
  }, [user.id_user, id_timetable]);

  useEffect(() => {
    if (selectedTimetable && selectedTimetable.daily_timetable_sheets) {
      const calculateWeeklyHours = async () => {
        const dailySheets = selectedTimetable.daily_timetable_sheets;
        const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const firstWeekDay = firstDayOfMonth.getDay(); // Sunday = 0, Monday = 1, etc.
        const weekStartOffset = (firstWeekDay + 6) % 7; // Adjust for Monday start
  
        const weeks = [];
        let currentWeek = [];
  
        for (let i = 0; i < dailySheets.length; i++) {
          const day = dailySheets[i];
          const dayDate = new Date(day.year, selectedDate.getMonth(), day.day);
          const dayOfWeek = (dayDate.getDay() + 6) % 7;
  
          if (dayOfWeek === 0 && currentWeek.length > 0) {
            // End of the week
            const weekHours = await Promise.all(
              currentWeek.map(async (weekDay) => {
                const data = await Daily_Timetable_Sheet.fetchWorkedHoursByDailyTimetable(
                  weekDay.id_daily_timetable
                );
                return data.worked_hours || 0;
              })
            );
            weeks.push(weekHours.reduce((acc, hours) => acc + hours, 0));
            currentWeek = [];
          }
  
          currentWeek.push(day);
        }
  
        if (currentWeek.length > 0) {
            console.log(currentWeek)
          const weekHours = await Promise.all(
            currentWeek.map(async (weekDay) => {
              const data = await Daily_Timetable_Sheet.fetchWorkedHoursByDailyTimetable(
                weekDay.id_daily_timetable
              );
              return data.worked_hours || 0;
            })
          );
          weeks.push(weekHours.reduce((acc, hours) => acc + hours, 0));
        }
  
        setWeeklyWorkedHours(weeks);
      };
  
      calculateWeeklyHours();
    }
  }, [selectedTimetable, selectedDate]);
  
  const handleMonthChange = (increment) => {
    const currentIndex = timetableData.findIndex(
      (t) => t.id_timetable === selectedTimetable.id_timetable
    );
    const newIndex = currentIndex + increment;

    if (newIndex >= 0 && newIndex < timetableData.length) {
      const newTimetable = timetableData[newIndex];
      const translatedMonth = frenchToEnglishMonths[newTimetable.month.toLowerCase()];

      if (!translatedMonth) {
        console.error(`Mois inconnu : ${newTimetable.month}`);
        return;
      }

      const newDate = new Date(
        `${newTimetable.year}-${new Intl.DateTimeFormat('en-US', { month: '2-digit' }).format(
          new Date(Date.parse(`${translatedMonth} 1`))
        )}-01`
      );

      const availableDates = [];
      const monthStart = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
      const monthEnd = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);

      for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
        availableDates.push(new Date(d));
      }

      setSelectedTimetable(newTimetable);
      setSelectedDate(newDate);
      setAvailablesDates(availableDates);
    }
  };

  const handleDateChange = (date) => {
    const isValid = availableDates.some(
      (d) => d.getDate() === date.getDate() &&
             d.getMonth() === date.getMonth() &&
             d.getFullYear() === date.getFullYear()
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
          availableDates={availableDates}
          weeklyWorkedHours={weeklyWorkedHours}
        />
        <MonthlyDetails selectedTimetable={selectedTimetable} />
      </div>
    </div>
  );
};

export default Mensual_Timetable;