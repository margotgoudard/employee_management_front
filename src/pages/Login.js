import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Auth from '../services/Auth'; 
import '../assets/styles/App.css';
import logo from '../assets/images/logo.png';
import background from '../assets/images/background.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user, token } = await Auth.login(email, password);

      dispatch({ type: 'auth/login', payload: { user, token } });

      alert('Connexion réussie!');
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      alert(error.message || 'Échec de la connexion. Vérifiez vos informations.');
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${background})` }}>
      <div className="form-container">
        <img src={logo} alt="Logo" className="logo" />
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">CONNEXION</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
