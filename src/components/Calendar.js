import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import '../assets/styles/Calendar.css';

const CalendarComponent = ({
  selectedDate,
  onDateChange,
  onMonthChange,
  availableDates,
  selectedTimetable,
  weeklyWorkedHours,
}) => {
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

  const isTileDisabled = ({ date, view }) => {
    if (view === 'month') {
      return !availableDates.some(
        (d) =>
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
      );
    }
    return false;
  };

  const getTileClassName = ({ date, view }) => {
    if (view === 'month' && selectedTimetable && selectedTimetable.daily_timetable_sheets) {
      const matchedDay = selectedTimetable.daily_timetable_sheets.find(
        (d) =>
          d.day === date.getDate() &&
          d.year === date.getFullYear() &&
          date.getMonth() ===
            new Date(`${frenchToEnglishMonths[selectedTimetable.month.toLowerCase()]} 1`).getMonth()
      );

      if (matchedDay) {
        if (!matchedDay.isCompleted) {
          return 'bubble-black';
        }
        return 'bubble-gray';
      }
      return 'disabled-day';
    }
    return '';
  };

  // Fonction pour calculer les semaines affichées dans le calendrier
  const getWeeksInMonth = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const weeks = [];
    let currentWeekStart = startOfMonth;

    while (currentWeekStart <= endOfMonth) {
      const currentWeekEnd = new Date(
        currentWeekStart.getFullYear(),
        currentWeekStart.getMonth(),
        currentWeekStart.getDate() + 6
      );

      weeks.push({
        start: new Date(currentWeekStart),
        end: new Date(Math.min(currentWeekEnd, endOfMonth)),
      });

      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }

    return weeks;
  };

  const weeksInMonth = getWeeksInMonth(selectedDate);

  return (
    <div className="calendar-wrapper">
      <div className="calendar-section">
        <div className="calendar-header">
          <BsArrowLeft onClick={() => onMonthChange(1)} />
          <h2>{selectedDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</h2>
          <BsArrowRight onClick={() => onMonthChange(-1)} />
        </div>
        <Calendar
          value={selectedDate}
          onChange={onDateChange}
          locale="fr-FR"
          tileClassName={getTileClassName}
          tileDisabled={isTileDisabled}
          showNavigation={false}
        />
      </div>
      <div className="weekly-hours-summary">
        <h3>total</h3>
        <ul>
          {weeklyWorkedHours.map((hours, index) => (
            <li key={index}>
              <span className="hours-value">{hours}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CalendarComponent;
