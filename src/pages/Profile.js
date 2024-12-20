import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../assets/styles/Profile.css';
import MensualTimetableSheet from '../services/MensualTimetableSheet';
import MonthlyTimetables from '../components/MonthlyTimetables';
import UserInfo from '../components/UserInfo';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const [fiches, setFiches] = useState([]);

  useEffect(() => {
    const fetchFiches = async () => {
      if (user?.id_user) {
        const fetchedFiches = await MensualTimetableSheet.fetchMensualTimetablesByUser(user.id_user);
        setFiches(fetchedFiches);
      }
    };

    fetchFiches();
  }, [user]);

  return (
    <div className="user-dashboard">
      <UserInfo user={user} />
      <MonthlyTimetables fiches={fiches} />
    </div>
  );
};

export default Profile;
