import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import '../assets/styles/Profile.css';
import MensualTimetableSheet from '../services/MensualTimetableSheet';
import User from '../services/User';
import MonthlyTimetables from '../components/MonthlyTimetables';
import UserInfo from '../components/UserInfo';

const Profile = () => {
  const connectedUser = useSelector((state) => state.auth.user); 
  const { id_user } = useParams(); 

  const [displayedUser, setDisplayedUser] = useState(null); 
  const [displayedFiches, setDisplayedFiches] = useState([]); // Assure-toi que l'état initial est un tableau vide
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const fetchDataExecuted = useRef(false);

  const fetchData = async () => {
    try {
      setLoading(true); 
      let fetchedUser = null;

      if (connectedUser?.id_user) {
        const fetchedFiches = await MensualTimetableSheet.fetchMensualTimetablesByUser(connectedUser.id_user);
        setDisplayedFiches(fetchedFiches); // Met à jour directement l'état des fiches
        fetchedUser = connectedUser;
      }

      if (id_user) {
        // Si un id_user est dans l'URL, charger cet utilisateur
        fetchedUser = await User.fetchUser(id_user);
      }

      if (fetchedUser) {
        setDisplayedUser(fetchedUser);
        const fetchedFiches = await MensualTimetableSheet.fetchMensualTimetablesByUser(fetchedUser.id_user);
        setDisplayedFiches(fetchedFiches); // Met à jour l'état des fiches
      } else {
        throw new Error("Utilisateur introuvable.");
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des données :", err);
      setError("Impossible de récupérer les données utilisateur.");
    } finally {
      setLoading(false); 
    }
  };

  const handleUpdateTimetables = () => {
    fetchData(); 
  };

  useEffect(() => {
    //if (fetchDataExecuted.current) return; // Empêche de refaire le fetch plusieurs fois
    fetchDataExecuted.current = true;

    fetchData(); // Appelle la fonction pour récupérer les données au premier rendu
  }, [id_user, connectedUser]);

  if (loading) {
    return <p>Chargement des informations utilisateur...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!displayedUser) {
    return <p>Aucun utilisateur à afficher.</p>;
  }

  return (
    <div className="user-dashboard">
      <UserInfo user={displayedUser} admin={!!id_user} /> 
      <MonthlyTimetables fiches={displayedFiches} admin={!!id_user} onUpdateTimetables={handleUpdateTimetables} />
    </div>
  );
};

export default Profile;
