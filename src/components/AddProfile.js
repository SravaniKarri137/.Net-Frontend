import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUserContext } from './UserContext';
import { useNavigate } from 'react-router-dom'; // ✅ useNavigate for redirect

const AddProfile = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    location: '',
    phone: '',
    email: '',
    skills: '',
  });
  const { userId } = useUserContext();
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // ✅ Hook to navigate programmatically

  useEffect(() => {
    if (!userId) {
      setError('❌ User not authenticated.');
    }
  }, [userId]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');

    const profileData = { ...profile, userId };
    console.log(profileData);

    try {
      const response = await axios.post('https://localhost:7235/api/profile', profileData);
      if (response.status === 201) {
        setSuccessMessage('🎉 Profile added successfully!');
        setProfile({
          fullName: '',
          location: '',
          phone: '',
          email: '',
          skills: '',
        });

        // ✅ Navigate to dashboard after 1.5s delay
        setTimeout(() => {
          navigate('/candidate-dashboard');
        }, 1500);
      }
    } catch (err) {
      setError('❌ Failed to add profile.');
      console.error(err);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '600px' }}>
        <h3 className="text-center text-primary mb-4">Add Your Profile</h3>

        {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              className="form-control"
              placeholder="City or town"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. 9876543210"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. yourname@example.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Skills</label>
            <input
              type="text"
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. JavaScript, React, Python"
              required
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg">
              Submit Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProfile;
