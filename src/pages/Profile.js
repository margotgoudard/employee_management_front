import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../assets/styles/Profile.css';
import MensualTimetableSheet from '../services/MensualTimetableSheet';
import User from '../services/User';
import MonthlyTimetables from '../components/MonthlyTimetables';
import UserInfo from '../components/UserInfo';
import { setTimetables } from '../redux/timetableSlice';

const Profile = ({ id_user }) => {
  const connectedUser = useSelector((state) => state.auth.user); 
  const dispatch = useDispatch();

  const [displayedUser, setDisplayedUser] = useState(null);
  const [displayedFiches, setDisplayedFiches] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  const fetchDataExecuted = useRef(false); // Pour vérifier si le fetch a déjà été effectué

  useEffect(() => {
    if (fetchDataExecuted.current) return; // Empêche d'exécuter à nouveau l'effet

    fetchDataExecuted.current = true; // Marque que le fetch a été effectué

    const fetchData = async () => {
      try {
        setLoading(true);
        if (id_user) {
          const fetchedUser = await User.fetchUser(id_user);
          setDisplayedUser(fetchedUser);

          if (fetchedUser?.id_user) {
            const fetchedFiches = await MensualTimetableSheet.fetchMensualTimetablesByUser(fetchedUser.id_user);
            setDisplayedFiches(fetchedFiches);
            dispatch(setTimetables(fetchedFiches));
          }
        } else if (connectedUser?.id_user) {
          setDisplayedUser(connectedUser);
          const fetchedFiches = await MensualTimetableSheet.fetchMensualTimetablesByUser(connectedUser.id_user);
          setDisplayedFiches(fetchedFiches);
          dispatch(setTimetables(fetchedFiches));
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
      <MonthlyTimetables fiches={displayedFiches} admin={id_user ? true : null} />
    </div>
  );
};

export default Profile;
