import React, { useState } from 'react';
import Form from './Form';

const LoginForm = ({ onLogin }) => {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

  const fields = [
    {
      name: 'mail',
      label: 'Mail',
      type: 'email',
      value: mail,
      onChange: setMail,
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
      onSubmit={({ mail, password }) => onLogin(mail, password)}
    />
  );
};

export default LoginForm;
