import React from 'react';

const Form = ({ fields, buttonText, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = fields.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});
    onSubmit(data);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div className="input-group" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                required={field.required}
              />
            </div>
          ))}
          <button type="submit" className="submit-btn">{buttonText}</button>
    </form>
  );
};

export default Form;
