import React from "react";
import { LuCircleMinus, LuCirclePlus } from "react-icons/lu";

const TimeSlots = ({
  timeSlots,
  newTimeSlots,
  placeCategories,
  onAddNewTimeSlot,
  onUpdateTimeSlot,
  onUpdateNewTimeSlot,
  onDeleteTimeSlot,
  onDeleteNewTimeSlot,
}) => {
  return (
    <div>
      <h3>Plages horaires :</h3>
      {timeSlots.length === 0 && newTimeSlots.length === 0 && <p>Vous n'avez aucune plage horaire.</p>}

      {timeSlots.map((slot) => (
        <div key={slot.id_time_slot} className="time-slot-item">
          <select
            value={slot.id_place_category || ""}
            onChange={(e) => onUpdateTimeSlot(slot.id_time_slot, "id_place_category", e.target.value)}
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
            onChange={(e) => onUpdateTimeSlot(slot.id_time_slot, "start", e.target.value)}
          />
          <input
            type="time"
            value={slot.end || ""}
            onChange={(e) => onUpdateTimeSlot(slot.id_time_slot, "end", e.target.value)}
          />
          <select
            value={slot.status || "Travaillé"}
            onChange={(e) => onUpdateTimeSlot(slot.id_time_slot, "status", e.target.value)}
          >
            <option value="Travaillé">Travaillé</option>
            <option value="Congés payés">Congés payés</option>
            <option value="Arrêt maladie">Arrêt maladie</option>
            <option value="Congés sans solde">Congés sans solde</option>
          </select>
          <button onClick={() => onDeleteTimeSlot(slot.id_time_slot)}>
            <LuCircleMinus />
          </button>
        </div>
      ))}

      {newTimeSlots.map((slot) => (
        <div key={slot.tempId} className="new-time-slot-item">
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
          <button onClick={() => onDeleteNewTimeSlot(slot.tempId)}>
            <LuCircleMinus />
          </button>
        </div>
      ))}

      <button onClick={onAddNewTimeSlot}>
        Ajouter une plage horaire <LuCirclePlus />
      </button>
    </div>
  );
};

export default TimeSlots;
