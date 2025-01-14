import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import '../assets/styles/Profile.css';
import MensualTimetableSheet from '../services/MensualTimetableSheet';
import User from '../services/User';
import MonthlyTimetables from '../components/MonthlyTimetables';
import UserInfo from '../components/UserInfo';
import { setTimetables } from '../redux/timetableSlice';

const Profile = () => {
  const connectedUser = useSelector((state) => state.auth.user); 
  const { id_user } = useParams(); 
  const dispatch = useDispatch();

  const [displayedUser, setDisplayedUser] = useState(null); 
  const [displayedFiches, setDisplayedFiches] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  const fetchDataExecuted = useRef(false);

  useEffect(() => {
    if (fetchDataExecuted.current) return; // Empêche de refaire le fetch plusieurs fois
    fetchDataExecuted.current = true;

    const fetchData = async () => {
      try {
        setLoading(true); 
        let fetchedUser = null;

        if (id_user) {
          console.log(id_user)
          // Si un id_user est dans l'URL, charger cet utilisateur
          fetchedUser = await User.fetchUser(id_user);
        } else if (connectedUser?.id_user) {
          // Sinon, charger l'utilisateur connecté
          fetchedUser = connectedUser;
        }

        if (fetchedUser) {
          setDisplayedUser(fetchedUser);
          const fetchedFiches = await MensualTimetableSheet.fetchMensualTimetablesByUser(fetchedUser.id_user);
          setDisplayedFiches(fetchedFiches);
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

    fetchData();
  }, [id_user, connectedUser, dispatch]);

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
      <UserInfo user={displayedUser} /> 
      <MonthlyTimetables fiches={displayedFiches} admin={!!id_user} />
    </div>
  );
};

export default Profile;
