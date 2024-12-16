import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../assets/styles/Profile.css';
import Mensual_Timetable_Sheet from '../services/Mensual_Timetable_Sheet';
import Monthly_Timetables from '../components/Monthly_Timetables';
import User_Info from '../components/User_Info';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const [fiches, setFiches] = useState([]);

  useEffect(() => {
    const fetchFiches = async () => {
      if (user?.id_user) {
        const fetchedFiches = await Mensual_Timetable_Sheet.fetchMensualTimetablesByUser(user.id_user);
        setFiches(fetchedFiches);
      }
    };

    fetchFiches();
  }, [user]);

  return (
    <div className="user-dashboard">
      <User_Info user={user} />
      <Monthly_Timetables fiches={fiches} />
    </div>
  );
};

export default Profile;
