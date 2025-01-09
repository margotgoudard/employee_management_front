import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../assets/styles/Profile.css';
import MensualTimetableSheet from '../services/MensualTimetableSheet';
import MonthlyTimetables from '../components/MonthlyTimetables';
import UserInfo from '../components/UserInfo';
import { setTimetables } from '../redux/timetableSlice';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const fiches = useSelector((state) => state.timetable.timetables); 
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFiches = async () => {
      if (user?.id_user) {
        const fetchedFiches = await MensualTimetableSheet.fetchMensualTimetablesByUser(user.id_user);
        dispatch(setTimetables(fetchedFiches)); 
      }
    };

    fetchFiches();
  }, [user, dispatch]);

  return (
    <div className="user-dashboard">
      <UserInfo user={user} />
      <MonthlyTimetables fiches={fiches} />
    </div>
  );
};

export default Profile;
