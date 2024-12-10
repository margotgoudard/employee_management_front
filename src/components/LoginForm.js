import React, { useState } from 'react';
import Form from './Form';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fields = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      value: email,
      onChange: setEmail,
      required: true,
    },
    {
      name: 'password',
      label: 'Mot de passe',
      type: 'password',
      value: password,
      onChange: setPassword,
      required: true,
    },
  ];

  return (
    <Form
      fields={fields}
      buttonText="CONNEXION"
      onSubmit={({ email, password }) => onLogin(email, password)}
    />
  );
};

export default LoginForm;
