import React, { useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import '../assets/styles/Calendar.css';

const CalendarComponent = ({
  selectedDate,
  onDateChange,
  onMonthChange,
  selectedTimetable,
  onDayClick
}) => {

  const getTileClassName = ({ date, view }) => {
    if (!selectedTimetable?.daily_timetable_sheets || !Array.isArray(selectedTimetable?.daily_timetable_sheets)) {
      return 'disabled-day';
    }      
    
    const matchedDay = selectedTimetable?.daily_timetable_sheets.find((d) => {
      const dayDate = new Date(d.day); 
      return (
        dayDate.getUTCDate() === date.getUTCDate() &&
        dayDate.getUTCMonth() === date.getUTCMonth() &&
        dayDate.getUTCFullYear() === date.getUTCFullYear()
      );
    });

    if (matchedDay) {
      if (!matchedDay.is_completed) {
        return 'bubble-blue';
      } else {
        if (matchedDay.status === 'Travaillé') {
          return 'bubble-gray';
        } else { 
          if (matchedDay.status === 'Week-end' || matchedDay.status === 'Férié') {
          return 'bubble-dark-gray';
          } 
            else {
              if(matchedDay.status === 'Demi-journée') {
                return 'bubble-half';
              }
          return 'bubble-orange';
          }
        }
      }
    }
    return 'disabled-day';
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-section">
        <div className="calendar-header">
          <BsArrowLeft onClick={() => onMonthChange(-1)} />
          <h2>{selectedDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</h2>
          <BsArrowRight onClick={() => onMonthChange(1)} />
        </div>
        <Calendar
          value={selectedDate}
          onChange={onDateChange}
          locale="fr-FR"
          tileClassName={getTileClassName}
          showNavigation={false}
          onClickDay={(value) => {
            onDayClick(value);
          }}
        />
      </div>
    </div>
  );
};

export default CalendarComponent;
