  import React, { useEffect, useState } from "react";
  import Time_Slot from "../services/Time_Slot";
  import ExpenseReportService from "../services/Expense_Report";
  import DailyTimetableService from "../services/Daily_Timetable_Sheet";
  import "../assets/styles/Daily_Timetable_Sheet.css";
  import { LuCirclePlus } from "react-icons/lu";
  import { LuCircleMinus } from "react-icons/lu";
  import Place_Category from "../services/Place_Category";
  import Notification from "./Notification";
  
  const Daily_Timetable_Sheet = ({ dailyTimetable }) => {
    const [timeSlots, setTimeSlots] = useState([]);
    const [expenseNotes, setExpenseNotes] = useState([]);
    const [newTimeSlots, setNewTimeSlots] = useState([]);
    const [newExpenses, setNewExpenses] = useState([]);
    const [timeSlotsToDelete, setTimeSlotsToDelete] = useState([]);
    const [expenseNotesToDelete, setExpenseNotesToDelete] = useState([]);
    const [status, setStatus] = useState(dailyTimetable.status);
    const [isDutyCall, setIsDutyCall] = useState(dailyTimetable.on_call_duty || false);
    const [placeCategories, setPlaceCategories] = useState([]);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  
    const showNotification = (message, type) => {
      setNotification({ show: true, message, type });
      setTimeout(() => setNotification({ show: false, message: "", type: "" }), 2000);
    };
  
    useEffect(() => {
      const fetchData = async () => {
        const slots = await Time_Slot.getTimeSlotsByDailyTimetable(dailyTimetable.id_daily_timetable);
        const categories = await Place_Category.fetchPlaceCategories();
        const expenses = await ExpenseReportService.getExpenseReportsByDailyTimetable(dailyTimetable.id_daily_timetable);
        setTimeSlots(slots);
        setExpenseNotes(expenses);
        setPlaceCategories(categories);
      };
       setTimeSlots([]);
       setExpenseNotes([]);
       setNewTimeSlots([]);
       setNewExpenses([]);
       setTimeSlotsToDelete([]);
       setExpenseNotesToDelete([]);
       setStatus(dailyTimetable.status);
       setIsDutyCall(dailyTimetable.on_call_duty || false);
   
       fetchData();
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
  
    const handleAddNewExpense = () => {
      setNewExpenses([
        ...newExpenses,
        {
          id_fee_category: "",
          client: "",
          amount: "",
          motive: "",
          tempId: Date.now(),
        },
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
    
    const handleSave = async () => {
  
      for (let slot of [...timeSlots, ...newTimeSlots]) {
        if (!slot.id_place_category || !slot.start || !slot.end) {
          showNotification("Veuillez remplir tous les champs des plages horaires.", "warning");
          return;
        }
      }
    
      for (let expense of [...expenseNotes, ...newExpenses]) {
        if (!expense.motive || !expense.client || !expense.amount) {
          showNotification("Veuillez remplir tous les champs des notes de frais.", "warning");
          return;
        }
      }
  
      try {
        for (let id_time_slot of timeSlotsToDelete) await Time_Slot.deleteTimeSlot(id_time_slot);
        for (let id_expense_report of expenseNotesToDelete) await ExpenseReportService.deleteExpenseReport(id_expense_report);
    
        for (let slot of newTimeSlots) {
          const { tempId, ...timeSlotData } = slot;
          await Time_Slot.createTimeSlot({
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
    
        for (let expense of expenseNotes) {
          await ExpenseReportService.updateExpenseReport(expense);
        }
        

        for (let slot of timeSlots) {
          await Time_Slot.updateTimeSlot(slot);
        }
    
        const daily_timetable_modified = await DailyTimetableService.updateDailyTimetable({
          ...dailyTimetable,
          status,
          on_call_duty: isDutyCall,
        });
    
        if (typeof dailyTimetable.onUpdate === "function") {
          dailyTimetable.onUpdate(daily_timetable_modified);
        }
    
        showNotification("Enregistrement réussi !", "success");
  
      } catch (error) {
        console.error("Erreur lors de l'enregistrement :", error);
      }
    };  
  
    return (
      <div className="daily-timetable-sheet">
          {notification && <Notification message={notification.message} type={notification.type} />}
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
  
        <div className="status-container">
          <label>Statut :</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
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
            />
          </label>
        </div>
  
        {(status === "Travaillé" || status === "Demi-journée") && (
          <>
            <h3>Plages horaires :</h3>
            {timeSlots.length === 0 && newTimeSlots.length === 0 && (
              <p>Vous n'avez aucune plage horaire.</p>
            )}
          {timeSlots.map((slot) => (
    <div key={slot.id_time_slot} className="time-slot-item">
      <select
        value={slot.id_place_category || ""}
        onChange={(e) => handleUpdateTimeSlot(slot.id_time_slot, "id_place_category", e.target.value)}
      >
        <option value="">Sélectionnez un lieu</option>
        {placeCategories.map((category) => (
          <option key={category.id_place_category} value={category.id_place_category}>
            {category.name}
          </option>
        ))}
      </select>
      <input
        type="time"
        value={slot.start || ""}
        onChange={(e) => handleUpdateTimeSlot(slot.id_time_slot, "start", e.target.value)}
      />
      <input
        type="time"
        value={slot.end || ""}
        onChange={(e) => handleUpdateTimeSlot(slot.id_time_slot, "end", e.target.value)}
      />
      <select
        value={slot.status || "Travaillé"} 
        onChange={(e) => handleUpdateTimeSlot(slot.id_time_slot, "status", e.target.value)}
      >
        <option value="Travaillé">Travaillé</option>
        <option value="Congés payés">Congés payés</option>
        <option value="Arrêt maladie">Arrêt maladie</option>
        <option value="Congés sans solde">Congés sans solde</option>
      </select>
      <button onClick={() => handleDeleteTimeSlot(slot.id_time_slot)}>
        <LuCircleMinus />
      </button>
    </div>
  ))}
  
  {newTimeSlots.map((slot) => (
    <div key={slot.tempId} className="new-time-slot-item">
      <select
        value={slot.placeCategory.name || ""}
        onChange={(e) => handleUpdateNewTimeSlot(slot.tempId, "id_place_category", e.target.value)}
      >
        {placeCategories.map((category) => (
          <option key={category.id_place_category} value={category.id_place_category}>
            {category.name}
          </option>
        ))}
      </select>
      <input
        type="time"
        value={slot.start || ""}
        onChange={(e) => handleUpdateNewTimeSlot(slot.tempId, "start", e.target.value)}
      />
      <input
        type="time"
        value={slot.end || ""}
        onChange={(e) => handleUpdateNewTimeSlot(slot.tempId, "end", e.target.value)}
      />
      <select
        value={slot.status || "Travaillé"}
        onChange={(e) => handleUpdateNewTimeSlot(slot.tempId, "status", e.target.value)}
      >
        <option value="Travaillé">Travaillé</option>
        <option value="Congés payés">Congés payés</option>
        <option value="Arrêt maladie">Arrêt maladie</option>
        <option value="Congés sans solde">Congés sans solde</option>
      </select>
      <button onClick={() => handleDeleteNewTimeSlot(slot.tempId)}>
        <LuCircleMinus />
      </button>
    </div>
  ))}
  
            <button onClick={handleAddNewTimeSlot}>Ajouter une plage horaire <LuCirclePlus /></button>
  
            <h3>Notes de frais :</h3>
            {expenseNotes.length === 0 && newExpenses.length === 0 && (
              <p>Vous n'avez aucune note de frais.</p>
            )}
            {expenseNotes.map((note) => (
  <div key={note.id_expense_report} className="expense-note-item">
    <select
      value={note.feeCategory.name || ""}
      onChange={(e) => handleUpdateExpense(note.id_expense_report, "id_fee_category", e.target.value)}
    >
      {placeCategories.map((category) => ( 
        <option key={category.id_place_category} value={category.id_place_category}>
          {category.name}
        </option>
      ))}
    </select>
    <input defaultValue={note.motive} placeholder="Motive"        
     onChange={(e) => handleUpdateNewExpense(note.tempId, "motive", e.target.value)}
    />
    <input defaultValue={note.client} placeholder="Client"
      onChange={(e) => handleUpdateNewExpense(note.tempId, "client", e.target.value)}
    />
    <input defaultValue={note.amount} placeholder="Total en CHF" 
      onChange={(e) => handleUpdateNewExpense(note.tempId, "amount", e.target.value)}
    />
    <button onClick={() => handleDeleteExpense(note.id_expense_report)}>
      <LuCircleMinus />
    </button>
  </div>
))}
{newExpenses.map((expense) => (
  <div key={expense.tempId} className="new-expense-note-item">
    <select
      value={expense.id_fee_category || ""}
      onChange={(e) => handleUpdateNewExpense(expense.tempId, "id_fee_category", e.target.value)}
    >
      <option value="">Sélectionnez une catégorie</option>
      {placeCategories.map((category) => (
        <option key={category.id_place_category} value={category.id_place_category}>
          {category.name}
        </option>
      ))}
    </select>
    <input placeholder="Objet" onChange={(e) => handleUpdateNewExpense(expense.tempId, "motive", e.target.value)} />
    <input placeholder="Client" onChange={(e) => handleUpdateNewExpense(expense.tempId, "client", e.target.value)} />
    <input placeholder="Total en CHF" onChange={(e) => handleUpdateNewExpense(expense.tempId, "amount", e.target.value)} />
    <button onClick={() => handleDeleteNewExpense(expense.tempId)}>
      <LuCircleMinus />
    </button>
  </div>
))}

            <button onClick={handleAddNewExpense}>Ajouter une note de frais <LuCirclePlus /></button>
          </>
        )}
  
        <button className="save-button" onClick={handleSave}>
          Enregistrer
        </button>
      </div>
    );
  };
  
  export default Daily_Timetable_Sheet;
  