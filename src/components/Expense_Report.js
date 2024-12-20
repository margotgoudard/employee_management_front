import React, { useState } from "react";
import { LuCircleMinus, LuCirclePlus } from "react-icons/lu";
import ExpenseReportItem from "./Expense_Report_Item";
import AddExpenseReportForm from "./Add_Expense_Report_Form";
import Fee_Category from "../services/Fee_Category";

const ExpenseReports = ({
  expenseNotes,
  newExpenses,
  feeCategories,
  onAddNewExpense,
  onDeleteExpense,
  onDeleteNewExpense,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddNewExpense = (newExpense) => {
    onAddNewExpense(newExpense);
    setShowAddForm(false); 
  };

  const handleCreateCategory = async (name) => {
    const response = await Fee_Category.createFeeCategory({ name });
    return response;
  };  

  return (
    <div>
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
                      category.id_place_category === note.id_fee_category
                  ) || { name: "N/A" },
                amount: note.amount || "N/A",
                client: note.client || "N/A",
                motive: note.motive || "N/A",
                document: note.document || null,
                document_name: note.document_name || "Aucun document",
                dailyTimetable: { day: note.date || new Date() },
              }}
            />
            <button onClick={() => onDeleteExpense(note.id_expense_report)}>
              <LuCircleMinus />
            </button>
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
              amount: expense.amount || "N/A",
              client: expense.client || "N/A",
              motive: expense.motive || "N/A",
              document_name: "Aucun document",
              dailyTimetable: { day: new Date() },
            }}
          />
          <button onClick={() => onDeleteNewExpense(expense.tempId)}>
            <LuCircleMinus />
          </button>
        </div>
      );
})}

      <button onClick={() => setShowAddForm(true)}>
        Ajouter une note de frais <LuCirclePlus />
      </button>

      {showAddForm && (
        <AddExpenseReportForm
        feeCategories={feeCategories}
        onAdd={handleAddNewExpense}
        onCancel={() => setShowAddForm(false)}
        onCreateCategory={handleCreateCategory}
      />      
      )}
    </div>
  );
};

export default ExpenseReports;
