import React, { useState } from "react";
import { LuUpload } from "react-icons/lu";
import "../assets/styles/AddExpenseReportForm.css";

const AddExpenseReportForm = ({ feeCategories, onAdd, onCancel, onCreateCategory }) => {
  const [formState, setFormState] = useState({
    id_fee_category: "",
    client: "",
    amount: "",
    motive: "",
    document: null,
    newCategory: "", 
  });

  const [isOtherCategory, setIsOtherCategory] = useState(false);

  const handleAdd = async () => {
    const { id_fee_category, client, amount, motive, newCategory } = formState;
  
    if (!client || !amount || (!motive && !isOtherCategory)) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
  
    let feeCategoryId = id_fee_category;
    let createdCategory = null;
  
    if (isOtherCategory && newCategory) {
      try {
        const createdCategory = await onCreateCategory(newCategory); 
        feeCategoryId = createdCategory.id_fee_category; 
      } catch (error) {
        console.error("Erreur lors de la création de la catégorie :", error);
        alert("Impossible de créer une nouvelle catégorie. Veuillez réessayer.");
        return;
      }
    } else {
      createdCategory = feeCategories.find(
        (category) => category.id_fee_category === id_fee_category
      );
    }
  
    const newExpense = {
      ...formState,
      id_fee_category: feeCategoryId, 
      feeCategory: createdCategory || null, 
      tempId: Date.now(), 
    };
  
    onAdd(newExpense); 
  };
  

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFormState({ ...formState, document: file });
  };

  const handleCategoryChange = (value) => {
    if (value === "other") {
      setIsOtherCategory(true);
      setFormState({ ...formState, id_fee_category: "", newCategory: "" });
    } else {
      setIsOtherCategory(false);
      setFormState({ ...formState, id_fee_category: value, newCategory: "" });
    }
  };

  return (
    <div className="add-expense-report-form">
      <div className="form-group">
        <label>Objet de la dépense</label>
        <div className="expense-category">
          <select
            value={isOtherCategory ? "other" : formState.id_fee_category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">Sélectionnez une catégorie</option>
            {feeCategories.map((category) => (
              <option
                key={category.id_fee_category}
                value={category.id_fee_category}
              >
                {category.name}
              </option>
            ))}
            <option value="other">Autre</option>
          </select>
          {isOtherCategory && (
            <input
              placeholder="Précisez..."
              value={formState.newCategory}
              onChange={(e) =>
                setFormState({ ...formState, newCategory: e.target.value })
              }
            />
          )}
        </div>
      </div>

      <div className="form-group">
        <label>Motif</label>
        <input
          placeholder="Motif"
          value={formState.motive}
          onChange={(e) =>
            setFormState({ ...formState, motive: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Client/Fournisseur</label>
        <input
          placeholder="Client/Fournisseur"
          value={formState.client}
          onChange={(e) =>
            setFormState({ ...formState, client: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Total notes de frais</label>
        <input
          placeholder="1000 CHF"
          value={formState.amount}
          onChange={(e) =>
            setFormState({ ...formState, amount: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Justificatif</label>
        <div className="file-upload">
          <label htmlFor="file-upload">
            Ajouter un justificatif <LuUpload />
          </label>
          <input
            type="file"
            id="file-upload"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
        </div>
      </div>

      <div className="form-buttons">
        <button className="add-button" onClick={handleAdd}>
          Ajouter
        </button>
        <button className="cancel-button" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </div>
  );
};

export default AddExpenseReportForm;
