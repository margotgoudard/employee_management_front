import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../assets/styles/Mensual_Timetable.css';
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useSelector } from 'react-redux';
import Mensual_Timetable_Sheet from '../services/Mensual_Timetable_Sheet';
import { useParams } from 'react-router-dom';

const Mensual_Timetable = () => {
  const user = useSelector((state) => state.auth.user);
  const { id_timetable } = useParams(); // Get the id_timetable from the URL
  const [timetableData, setTimetableData] = useState([]); // Initial empty array for timetable data
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimetable, setSelectedTimetable] = useState([]); // Initial empty array for timetable data
  const [availableDates, setAvailablesDates] = useState([]); // Initial empty array for timetable data

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
        setTimetableData(data || []); // Set the resolved data or an empty array
  
        if (data && data.length > 0) {
          let selectedTimetable;
          if (id_timetable) {
            // Find the timetable with the given id_timetable
            selectedTimetable = data.find((t) => t.id_timetable === parseInt(id_timetable));
          }
          if (!selectedTimetable) {
            // Default to the last timetable if no match is found
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
  
          // Generate all dates for the selected month
          const availableDates = [];
          const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
          const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0); // Last day of the month
  
          for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
            availableDates.push(new Date(d)); // Add each date to the array
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
  

  const handleMonthChange = (increment) => {
    if (timetableData.length > 0) {
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

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      // Trouver le daily_timetable_sheet correspondant à la date
      const matchedDay = selectedTimetable.daily_timetable_sheets.find(
        (d) =>
          d.day === date.getDate() &&
          d.year === date.getFullYear() &&
          date.getMonth() ===
            new Date(`${frenchToEnglishMonths[selectedTimetable.month.toLowerCase()]} 1`).getMonth()
      );
  
      if (matchedDay) {
        if (!matchedDay.isCompleted) {
          return 'bubble-black'; // Classe pour un rond noir
        }
        return 'bubble-gray'; // Classe pour un rond gris (par défaut)
      }
      return 'disabled-day'; // Classe pour les jours non disponibles
    }
    return '';
  };
  

  const isTileDisabled = ({ date, view }) => {
    if (view === 'month') {
      return !availableDates.some(
        (d) => d.getDate() === date.getDate() &&
               d.getMonth() === date.getMonth() &&
               d.getFullYear() === date.getFullYear()
      );
    }
    return false;
  };  

  return (
    <div className="mensual-timetable">
      <div className="calendar-section">
        <div className="calendar-header">
          <BsArrowLeft onClick={() => handleMonthChange(1)} />
          <h2>{selectedDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</h2>
          <BsArrowRight onClick={() => handleMonthChange(-1)} />
        </div>
        <Calendar
          value={selectedDate}
          onChange={handleDateChange}
          locale="fr-FR"
          tileClassName={getTileClassName}
          tileDisabled={isTileDisabled}
          showNavigation={false}
        />
      </div>

      <div className="monthly-details">
        <h3>Fiche du mois</h3>
            <div className="detail-item">
              <label>Total commissions</label>
              <input
                type="number"
                name="totalCommissions"
                value={timetableData[0]?.totalCommissions || 0}
                readOnly
              />
              <span>CHF</span>
            </div>
            <div className="detail-item">
              <label>Total heures</label>
              <input
                type="number"
                name="totalHours"
                value={timetableData[0]?.totalHours || 0}
                readOnly
              />
              <span>heures</span>
            </div>
            <div className="detail-item">
              <label>Total notes de frais</label>
              <input
                type="number"
                name="totalExpenses"
                value={timetableData[0]?.totalExpenses || 0}
                readOnly
              />
              <span>CHF</span>
            </div>
            <div className="detail-item">
              <label>Commentaire</label>
              <textarea
                name="comment"
                value={timetableData[0]?.comment || ''}
                readOnly
              />
            </div>
      </div>
    </div>
  );
};

export default Mensual_Timetable;
