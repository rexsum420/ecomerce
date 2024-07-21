import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EditProfile from './EditProfile';

const Profile = () => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get('user');
  const loggedInUsername = localStorage.getItem('username');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://192.168.1.75:8000/api/profiles/${username}/`);
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [username]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  if (username === loggedInUsername) {
    return <EditProfile />;
  }

  return (
    <div>
      <h1>Profile of {profile.user}</h1>
      <p>Email: {profile.email}</p>
      <p>First Name: {profile.first_name}</p>
      <p>Last Name: {profile.last_name}</p>
      <p>Phone Number: {profile.phone_number}</p>
    </div>
  );
};

export default Profile;
