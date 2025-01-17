import React from "react";
import { LuCircleMinus, LuCirclePlus } from "react-icons/lu";
import '../assets/styles/TimeSlot.css';

const TimeSlots = ({
  timeSlots,
  newTimeSlots,
  placeCategories,
  isDisabled,
  onAddNewTimeSlot,
  onUpdateTimeSlot,
  onUpdateNewTimeSlot,
  onDeleteTimeSlot,
  onDeleteNewTimeSlot,
}) => {

  const checkOverlap = (slot, allSlots) => {
    return allSlots.some((otherSlot) => {
      if (slot === otherSlot) return false;

      const slotStart = new Date(`1970-01-01T${slot.start}`);
      const slotEnd = new Date(`1970-01-01T${slot.end}`);
      const otherStart = new Date(`1970-01-01T${otherSlot.start}`);
      const otherEnd = new Date(`1970-01-01T${otherSlot.end}`);

      return (
        (slotStart < otherEnd && slotEnd > otherStart) 
      );
    });
  };

  const allSlots = [...timeSlots, ...newTimeSlots];


  return (
    <div>
    <h3>Plages horaires :</h3>
    {timeSlots.length === 0 && newTimeSlots.length === 0 && <p>Vous n'avez aucune plage horaire.</p>}

    {timeSlots.map((slot) => {
      const isOverlapping = checkOverlap(slot, allSlots);

      return (
        <div key={slot.id_time_slot} className={`time-slot-item ${isOverlapping ? "error" : ""}`}>
          <select
            disabled={isDisabled}
            value={slot.id_place_category || ""}
            onChange={(e) => onUpdateTimeSlot(slot.id_time_slot, "id_place_category", e.target.value)}
          >
            <option value="">Sélectionnez un lieu</option>
            {placeCategories.map((category) => (
              <option 
                key={category.id_place_category} 
                value={category.id_place_category}
              >
                {category.name}
              </option>
            ))}
          </select>
          <input
            disabled={isDisabled}
            type="time"
            value={slot.start || ""}
            onChange={(e) => onUpdateTimeSlot(slot.id_time_slot, "start", e.target.value)}
          />
          <input
            disabled={isDisabled}
            type="time"
            value={slot.end || ""}
            onChange={(e) => onUpdateTimeSlot(slot.id_time_slot, "end", e.target.value)}
          />
          <select
            disabled={isDisabled}
            value={slot.status || "Travaillé"}
            onChange={(e) => onUpdateTimeSlot(slot.id_time_slot, "status", e.target.value)}
          >
            <option value="Travaillé">Travaillé</option>
            <option value="Congés payés">Congés payés</option>
            <option value="Arrêt maladie">Arrêt maladie</option>
            <option value="Congés sans solde">Congés sans solde</option>
          </select>
          {!isDisabled &&
            <button onClick={() => onDeleteTimeSlot(slot.id_time_slot)}>
              <LuCircleMinus />
            </button>
          }
        </div>
      );
    })}

    {newTimeSlots.map((slot) => {
      const isOverlapping = checkOverlap(slot, allSlots);

        return (
          <div key={slot.id_time_slot} className={`time-slot-item ${isOverlapping ? "error" : ""}`}>
            <select
            value={slot.id_place_category || ""}
            onChange={(e) => onUpdateNewTimeSlot(slot.tempId, "id_place_category", e.target.value)}
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
            onChange={(e) => onUpdateNewTimeSlot(slot.tempId, "start", e.target.value)}
          />
          <input
            type="time"
            value={slot.end || ""}
            onChange={(e) => onUpdateNewTimeSlot(slot.tempId, "end", e.target.value)}
          />
          <select
            value={slot.status || "Travaillé"}
            onChange={(e) => onUpdateNewTimeSlot(slot.tempId, "status", e.target.value)}
          >
            <option value="Travaillé">Travaillé</option>
            <option value="Congés payés">Congés payés</option>
            <option value="Arrêt maladie">Arrêt maladie</option>
            <option value="Congés sans solde">Congés sans solde</option>
          </select>
          {!isDisabled &&
            <button onClick={() => onDeleteNewTimeSlot(slot.tempId)}>
              <LuCircleMinus />
            </button>
          }
        </div>
       );
      })}

      {!isDisabled &&
        <div className="button-container">
          <button className="add-time-slot-button" onClick={onAddNewTimeSlot}>
            Ajouter une plage horaire <LuCirclePlus />
          </button>
        </div>
      }
    </div>
  );
};

export default TimeSlots;
