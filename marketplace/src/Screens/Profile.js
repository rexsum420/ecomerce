// src/Screens/Profile.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { username } = useParams();
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
