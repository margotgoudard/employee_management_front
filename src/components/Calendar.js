import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import '../assets/styles/Calendar.css';
import { getISOWeek } from 'date-fns'; 
import { useSelector } from 'react-redux';

const CalendarComponent = ({
  selectedDate,
  weeklyHours,
  onDateChange,
  onMonthChange,
  onDayClick,
  managerView,
}) => {
  const [activeStartDate, setActiveStartDate] = useState(selectedDate);
  const [activatedDate, setActivatedDate] = useState(null);
  const selectedTimetable = useSelector((state) => state.timetable.selectedTimetable);

  useEffect(() => {
    setActiveStartDate(selectedDate);
  }, [selectedDate]);


  const getTileClassName = ({ date, view }) => {
    if (
      activatedDate &&
      date.getUTCDate() === activatedDate.getUTCDate() &&
      date.getUTCMonth() === activatedDate.getUTCMonth() &&
      date.getUTCFullYear() === activatedDate.getUTCFullYear()
    ) {
      return 'bubble-green';
    }
  
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
        return 'bubble-dark-gray';
      } else {
        if (matchedDay.status === 'Travaillé') {
          return 'bubble-blue';
        } else {
          if (matchedDay.status === 'Week-end' || matchedDay.status === 'Férié') {
            return 'bubble-dark-gray-circle';
          } else {
            if (matchedDay.status === 'Demi-journée') {
              return 'bubble-half';
            }
            return 'bubble-orange';
          }
        }
      }
    }
    return 'disabled-day';
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      if(date.getDay() === 1){
        const weekNumber = getISOWeek(date); 
        return (
          <div className='week'>
            {`Semaine ${weekNumber}`}
          </div>
        );
      }else if(date.getDay() === 0){
        const hours = weeklyHours[date];
  
        return (
          <div className='hours'>
            {hours ? `${hours}H` : null}
          </div>
        );
    }
    return null; 
  };
}
  
  return (
    <div className="calendar-wrapper">
      <div className="calendar-section">
      <div className="calendar-header">
        {!managerView && ( 
          <BsArrowLeft onClick={() => onMonthChange(-1)} />
        )}
        <h2>{activeStartDate?.toLocaleString("fr-FR", { month: "long", year: "numeric" })}</h2>
        {!managerView && ( 
          <BsArrowRight onClick={() => onMonthChange(1)} />
        )}
      </div>
        <Calendar
          value={selectedDate}
          activeStartDate={activeStartDate} 
          onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)} 
          onChange={onDateChange}
          locale="fr-FR"
          tileClassName={getTileClassName}
          showNavigation={false}
          onClickDay={(value) => {
            onDayClick(value);
            setActivatedDate(value); 
          }}
          tileContent={weeklyHours && tileContent}
        />
      </div>
    </div>
  );
};

export default CalendarComponent;
