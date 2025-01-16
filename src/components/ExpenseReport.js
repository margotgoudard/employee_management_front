import React, { useState } from "react";
import { LuCircleMinus, LuCirclePlus } from "react-icons/lu";
import ExpenseReportItem from "./ExpenseReportItem";
import AddExpenseReportForm from "./AddExpenseReportForm";
const ExpenseReports = ({
  expenseNotes,
  newExpenses,
  feeCategories,
  isDisabled,
  onAddNewExpense,
  onDeleteExpense,
  onDeleteNewExpense,
  onShowAddForm,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddNewExpense = (newExpense) => {
    onAddNewExpense(newExpense);
    setShowAddForm(false); 
    onShowAddForm(false);
  };

  return (
    <div className="expense-reports-container">
      <h3>Notes de frais :</h3>
      {expenseNotes.length === 0 && newExpenses.length === 0 && (
        <p>Vous n'avez aucune note de frais.</p>
      )}

      <ul>
        {expenseNotes.map((note) => (
          <div key={note.id_expense_report} className="expense-note-item">
            <ExpenseReportItem
              report={{
                feeCategory:
                  feeCategories.find(
                    (category) =>
                      category.id_fee_category === note.id_fee_category
                  ) || { name: "N/A" },
                amount: note.amount || "N/A",
                client: note.client || "N/A",
                motive: note.motive || "N/A",
                document: note.document || null,
                document_name: note.document_name || "Aucun document",
                dailyTimetable: { day: note.date || new Date() },
              }}
            />
            {!isDisabled &&
            <button onClick={() => onDeleteExpense(note.id_expense_report)}>
              <LuCircleMinus />
            </button>
            }
          </div>
        ))}
      </ul>

      {newExpenses.length > 0 && <h4>Nouvelles notes de frais :</h4>}

      {newExpenses.map((expense) => {
        return (
        <div key={expense.tempId} className="new-expense-note-item">
          <ExpenseReportItem
            report={{
              feeCategory:expense.feeCategory,
              amount: expense.amount,
              client: expense.client,
              motive: expense.motive,
              document_name: expense.document_name,
              document: expense.document,
              dailyTimetable: { day: new Date() },
            }}
          />
          {!isDisabled &&
            <button onClick={() => onDeleteNewExpense(expense.tempId)}>
              <LuCircleMinus />
            </button>
          }
        </div>
      );
    })}
    {!isDisabled &&
      <div className="button-container">
        <button
          className="add-expense-button"
          onClick={() => {
            setShowAddForm(true);
            onShowAddForm(true);
          }}
        >
          Ajouter une note de frais <LuCirclePlus />
        </button>
      </div>
    }

      {showAddForm && (
        <AddExpenseReportForm
        feeCategories={feeCategories}
        onAdd={handleAddNewExpense}
        onCancel={() => {
          setShowAddForm(false);
          onShowAddForm(false); 
        }}
      />      
      )}
    </div>
  );
};

export default ExpenseReports;
