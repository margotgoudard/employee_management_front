import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Auth from '../services/Auth';
import logo from '../assets/images/logo.png';
import background from '../assets/images/background.jpg';
import ChangePasswordForm from '../components/ChangePasswordForm';
import LoginForm from '../components/LoginForm';
import User from '../services/User';

const Login = () => {
  const [showComponent, setShowComponent] = useState('login');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogin = async (email, password) => {
    try {
      const { user, token } = await Auth.login(email, password);
      dispatch({ type: 'auth/login', payload: { user, token } });

      if (user.last_connected) {
        navigate('/profile');
      } else {
        setShowComponent('changePassword');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      alert(error.message || 'Échec de la connexion. Vérifiez vos informations.');
    }
  };

  const handleChangePassword = async (newPassword, confirmationPassword) => {
    try {
      await User.ChangePassword(user, newPassword, confirmationPassword);
      navigate('/profile'); 
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe :', error);
      alert(error.message || 'Impossible de changer le mot de passe.');
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${background})` }}>
      <div className="form-container">
        <img src={logo} alt="Logo" className="logo" />
        {showComponent === 'login' && <LoginForm onLogin={handleLogin} />}
        {showComponent === 'changePassword' && <ChangePasswordForm onChangePassword={handleChangePassword} />}
      </div>
    </div>
  );
};

export default Login;
