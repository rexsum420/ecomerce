// src/Screens/EditProfile.js
import React, { useState, useEffect } from 'react';

const EditProfile = () => {
  const [profile, setProfile] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const username = localStorage.getItem('username');
      try {
        const response = await fetch(`http://192.168.1.75:8000/api/profiles/${username}/`);
        const data = await response.json();
        setProfile({
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem('username');
    try {
      const response = await fetch(`http://192.168.1.75:8000/api/profiles/${username}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        alert('Profile updated successfully');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Profile</h1>
      <label>
        Email:
        <input type="email" name="email" value={profile.email} onChange={handleChange} required />
      </label>
      <label>
        First Name:
        <input type="text" name="first_name" value={profile.first_name} onChange={handleChange} />
      </label>
      <label>
        Last Name:
        <input type="text" name="last_name" value={profile.last_name} onChange={handleChange} />
      </label>
      <label>
        Phone Number:
        <input type="tel" name="phone_number" value={profile.phone_number} onChange={handleChange} />
      </label>
      <button type="submit">Save</button>
    </form>
  );
};

export default EditProfile;
