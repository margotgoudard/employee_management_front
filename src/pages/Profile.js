import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import '../assets/styles/Profile.css';
import MensualTimetableSheet from '../services/MensualTimetableSheet';
import User from '../services/User';
import MonthlyTimetables from '../components/MonthlyTimetables';
import UserInfo from '../components/UserInfo';
import Permissions from '../components/Permissions';
import { setTimetables } from '../redux/timetableSlice';

const Profile = () => {
  const connectedUser = useSelector((state) => state.auth.user); 
  const { id_user } = useParams(); 
  const selectedTimetable = useSelector((state) => state.timetable.selectedTimetable);
  const [displayedUser, setDisplayedUser] = useState(null); 
  const [displayedFiches, setDisplayedFiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const fetchDataExecuted = useRef(false);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (selectedTimetable && displayedUser) { 
      setDisplayedFiches((prevFiches) => 
        prevFiches.map((fiche) => 
          fiche.id_timetable === selectedTimetable.id_timetable ? selectedTimetable : fiche
        )
      );
    }
  }, [selectedTimetable, displayedUser]);

  useEffect(() => {
    if (!connectedUser?.id_user) return;

    fetchDataExecuted.current = true;

    const fetchData = async () => {
      try {
        setLoading(true); 
  
        if (connectedUser?.id_user) {
          const fetchedFiches = await MensualTimetableSheet.fetchMensualTimetablesByUser(connectedUser.id_user);
          setDisplayedFiches(fetchedFiches); 
          dispatch(setTimetables(fetchedFiches))
          setDisplayedUser(connectedUser);
        }
  
        if (id_user) {
          const fetchedUser = await User.fetchUser(id_user);
          setDisplayedUser(fetchedUser);
          const fetchedFiches = await MensualTimetableSheet.fetchMensualTimetablesByUser(fetchedUser.id_user);
          setDisplayedFiches(fetchedFiches); 
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
      <div className="user-info-container">
        <UserInfo user={displayedUser} admin={!!id_user} />
        <MonthlyTimetables 
          fiches={displayedFiches} 
          admin={!!id_user} 
        />
      </div>
      
      {id_user && <Permissions id_user={id_user} />}
    </div>
  );
};

export default Profile;
