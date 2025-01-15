  import React, { useEffect, useState } from "react";
  import TimeSlot from "../services/TimeSlot";
  import ExpenseReportService from "../services/ExpenseReport";
  import DailyTimetableService from "../services/DailyTimetableSheet";
  import "../assets/styles/DailyTimetableSheet.css";
  import PlaceCategory from "../services/PlaceCategory";
  import Alert from "./Alert";
  import TimeSlots from "./TimeSlots";
  import ExpenseReports from "./ExpenseReport";
  import FeeCategory from "../services/FeeCategory";
  import { GoAlertFill } from "react-icons/go";
    
  const DailyTimetableSheet = ({ dailyTimetable, isDisabled, complianceCheckResult, onTimetableUpdate  }) => {
    const [timeSlots, setTimeSlots] = useState([]);
    const [expenseNotes, setExpenseNotes] = useState([]);
    const [newTimeSlots, setNewTimeSlots] = useState([]);
    const [newExpenses, setNewExpenses] = useState([]);
    const [timeSlotsToDelete, setTimeSlotsToDelete] = useState([]);
    const [expenseNotesToDelete, setExpenseNotesToDelete] = useState([]);
    const [status, setStatus] = useState(dailyTimetable.status);
    const [isDutyCall, setIsDutyCall] = useState(dailyTimetable.on_call_duty || false);
    const [placeCategories, setPlaceCategories] = useState([]);
    const [feeCategories, setFeeCategories] = useState([]);
    const [alert, setAlert] = useState({ show: false, message: "", type: "" });
    const [initialTimeSlots, setInitialTimeSlots] = useState([]);
    const [initialExpenseNotes, setInitialExpenseNotes] = useState([]);
    
    const showAlert = (message, type) => {
      setAlert({ show: true, message, type });
      setTimeout(() => setAlert({ show: false, message: "", type: "" }), 2000);
    };
  
    useEffect(() => {
      const fetchData = async () => {
        const slots = await TimeSlot.getTimeSlotsByDailyTimetable(dailyTimetable.id_daily_timetable);
        const categories = await PlaceCategory.fetchPlaceCategories();
        const expenses = await ExpenseReportService.getExpenseReportsByDailyTimetable(dailyTimetable.id_daily_timetable);
        const feeCategories = await FeeCategory.fetchFeeCategories();

        setTimeSlots(slots);
        setInitialTimeSlots(slots); 
    
        setExpenseNotes(expenses);
        setInitialExpenseNotes(expenses);
    
        setPlaceCategories(categories);
        setFeeCategories(feeCategories);
      };

      setTimeSlotsToDelete([]);
      setExpenseNotesToDelete([]);
      setStatus(dailyTimetable.status);
      setIsDutyCall(dailyTimetable.on_call_duty || false);

      fetchData();
    }, [dailyTimetable?.id_daily_timetable]);

    useEffect(() => {
      const fetchData = async () => {
        const slots = await TimeSlot.getTimeSlotsByDailyTimetable(dailyTimetable.id_daily_timetable);
        const expenses = await ExpenseReportService.getExpenseReportsByDailyTimetable(dailyTimetable.id_daily_timetable);
        setTimeSlots(slots);
        setInitialTimeSlots(slots); 
        setExpenseNotes(expenses);
        setInitialExpenseNotes(expenses);
      }
      fetchData();
      setNewTimeSlots([]);
      setNewExpenses([]);
      setTimeSlotsToDelete([]);
      setExpenseNotesToDelete([]);
    }, [dailyTimetable]);
    
  
    const handleDeleteTimeSlot = (id) => {
      setTimeSlots(timeSlots.filter((slot) => slot.id_time_slot !== id));
      setTimeSlotsToDelete([...timeSlotsToDelete, id]);
    };
  
    const handleDeleteNewTimeSlot = (tempId) => {
      setNewTimeSlots(newTimeSlots.filter((slot) => slot.tempId !== tempId));
    };
  
    const handleDeleteExpense = (id) => {
      setExpenseNotes(expenseNotes.filter((note) => note.id_expense_report !== id));
      setExpenseNotesToDelete([...expenseNotesToDelete, id]);
    };
  
    const handleDeleteNewExpense = (tempId) => {
      setNewExpenses(newExpenses.filter((expense) => expense.tempId !== tempId));
    };
  
    const handleAddNewTimeSlot = () => {
      setNewTimeSlots([
        ...newTimeSlots,
        {
          id_place_category: 1,
          start: "",
          end: "",
          status: "Travaillé", 
          tempId: Date.now(),
          id_daily_timetable: dailyTimetable.id_daily_timetable,
        },
      ]);
    };  
  
    const handleAddNewExpense = (newExpense) => {
      setNewExpenses([
        ...newExpenses,
        newExpense
      ]);
    };
    
  
    const handleUpdateTimeSlot = (id, key, value) => {
      setTimeSlots((prev) =>
        prev.map((slot) => (slot.id_time_slot === id ? { ...slot, [key]: value } : slot))
      );
    };
  
    const handleUpdateNewTimeSlot = (tempId, key, value) => {
      setNewTimeSlots((prev) =>
        prev.map((slot) => (slot.tempId === tempId ? { ...slot, [key]: value } : slot))
      );
    };
  
    const handleUpdateExpense = (id, key, value) => {
      setExpenseNotes((prev) =>
        prev.map((note) => (note.id_expense_report === id ? { ...note, [key]: value } : note))
      );
    };

    const handleUpdateNewExpense = (tempId, key, value) => {
      setNewExpenses((prev) =>
        prev.map((expense) => (expense.tempId === tempId ? { ...expense, [key]: value } : expense))
      );
    };    

    const handleCancel = () => {
      setTimeSlots(initialTimeSlots);
      setExpenseNotes(initialExpenseNotes);
      setNewTimeSlots([]);
      setNewExpenses([]);
      setTimeSlotsToDelete([]);
      setExpenseNotesToDelete([]);
      setStatus(dailyTimetable.status);
      setIsDutyCall(dailyTimetable.on_call_duty || false);
    };
    
    const handleSave = async () => {
      try {
        const modifiedTimeSlots = timeSlots.filter((slot) => {
          const initialSlot = initialTimeSlots.find((s) => s.id_time_slot === slot.id_time_slot);
          return initialSlot && JSON.stringify(initialSlot) !== JSON.stringify(slot); 
        });
    
        const modifiedExpenseNotes = expenseNotes.filter((note) => {
          const initialNote = initialExpenseNotes.find((n) => n.id_expense_report === note.id_expense_report);
          return initialNote && JSON.stringify(initialNote) !== JSON.stringify(note); 
        });
    
        for (let id_time_slot of timeSlotsToDelete) {
          await TimeSlot.deleteTimeSlot(id_time_slot);
        }
    
        for (let id_expense_report of expenseNotesToDelete) {
          await ExpenseReportService.deleteExpenseReport(id_expense_report);
        }
    
        for (let slot of newTimeSlots) {
          const { tempId, ...timeSlotData } = slot;
          await TimeSlot.createTimeSlot({
            ...timeSlotData,
            id_daily_timetable: dailyTimetable.id_daily_timetable,
          });
        }
    
        for (let expense of newExpenses) {
          const { tempId, ...expenseReportData } = expense;
          await ExpenseReportService.createExpenseReport({
            ...expenseReportData,
            id_daily_timetable: dailyTimetable.id_daily_timetable,
          });
        }
    
        for (let slot of modifiedTimeSlots) {
          await TimeSlot.updateTimeSlot(slot); 
        }
    
        for (let note of modifiedExpenseNotes) {
          await ExpenseReportService.updateExpenseReport(note); 
        }
    
        const daily_timetable_modified = await DailyTimetableService.updateDailyTimetable({
          ...dailyTimetable,
          status,
          on_call_duty: isDutyCall,
        });
    
        if (typeof dailyTimetable.onUpdate === "function") {
          dailyTimetable.onUpdate(daily_timetable_modified);
        }
        onTimetableUpdate(daily_timetable_modified);
        showAlert("Enregistrement réussi !", "success");
      } catch (error) {
        console.error("Erreur lors de l'enregistrement :", error);
      }
    };    
  
    return (
      <div className="daily-timetable-sheet">
          {alert && <Alert message={alert.message} type={alert.type} />}
        <div className="date-container">
          <h2>
            {new Date(dailyTimetable.day).toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h2>
        </div>
        
        {complianceCheckResult && (
          <div className="compliance-check-result">
            <h3 className="compliance-check-result-title"><GoAlertFill /><span>Warning - Vérification de conformité</span> <GoAlertFill /></h3>
            <div className="compliance-check-result-list">
              {complianceCheckResult.map((element, index) => (
                <div key={index} className="compliance-check-result-item">
                  {element}
                </div>
              ))}
            </div>
          </div>
        )}
  
        <div className="status-container">
          <label>Statut :</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={isDisabled}>
            <option value="Travaillé">Travaillé</option>
            <option value="Week-end">Week-end</option>
            <option value="Férié">Férié</option>
            <option value="Congés payés">Congés payés</option>
            <option value="Arrêt maladie">Arrêt maladie</option>
            <option value="Congés sans solde">Congés sans solde</option>
            <option value="Demi-journée">Demi-journée</option>
          </select>
  
          <label className="astreinte-checkbox">
            Astreinte :
            <input
              type="checkbox"
              checked={isDutyCall}
              onChange={(e) => setIsDutyCall(e.target.checked)}
              disabled={isDisabled}
            />
          </label>
        </div>
  
        {(status === "Travaillé" || status === "Demi-journée") && (

           <><TimeSlots
            timeSlots={timeSlots}
            newTimeSlots={newTimeSlots}
            placeCategories={placeCategories}
            isDisabled={isDisabled}
            onAddNewTimeSlot={handleAddNewTimeSlot}
            onUpdateTimeSlot={handleUpdateTimeSlot}
            onUpdateNewTimeSlot={handleUpdateNewTimeSlot}
            onDeleteTimeSlot={handleDeleteTimeSlot}
            onDeleteNewTimeSlot={handleDeleteNewTimeSlot} />
            
            <ExpenseReports
              expenseNotes={expenseNotes}
              newExpenses={newExpenses}
              feeCategories={feeCategories}
              isDisabled={isDisabled}
              onAddNewExpense={handleAddNewExpense}
              onUpdateExpense={handleUpdateExpense}
              onUpdateNewExpense={handleUpdateNewExpense}
              onDeleteExpense={handleDeleteExpense}
              onDeleteNewExpense={handleDeleteNewExpense} /></>   
        )}

        {!isDisabled && 
          <div className="button-container">
            <button className="save-button" onClick={handleSave}>
              Enregistrer
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              Annuler
            </button>
          </div>
        }
      </div>
    );
  };
  
  export default DailyTimetableSheet;
  