import React, { useState } from 'react';
import Form from './Form';

const ChangePasswordForm = ({ onChangePassword }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fields = [
    {
      name: 'new-password',
      label: 'Nouveau mot de passe',
      type: 'password',
      value: newPassword,
      onChange: setNewPassword,
      required: true,
    },
    {
      name: 'confirm-password',
      label: 'Confirmation',
      type: 'password',
      value: confirmPassword,
      onChange: setConfirmPassword,
      required: true,
    },
  ];

  const handleSubmit = (data) => {
    if (data['new-password'] !== data['confirm-password']) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    onChangePassword(data['new-password']);
  };

  return <Form fields={fields} buttonText="CRÉER" onSubmit={handleSubmit} />;
};

export default ChangePasswordForm;
