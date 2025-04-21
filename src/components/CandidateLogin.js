import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from './UserContext';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const CandidateLogin = () => {
  const [credentials, setCredentials] = useState({ userName: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { setUserId, setEmail, setUsername } = useUserContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('https://localhost:7235/api/Auth/login', credentials);

      if (res.data.role === 'candidate') {
        console.log(res.data); // Debugging: Check exact structure
        localStorage.setItem('userId', res.data.userId);    // Correct property: userId (from backend)
        localStorage.setItem('role', res.data.role);        // Correct property: role (from backend)
        localStorage.setItem('email', res.data.email);      // Correct property: email (from backend)
        localStorage.setItem('username', res.data.username); // Correct property: username (from backend)
        
        setUserId(res.data.userId);    // Use userId with lowercase 'u' (from backend)
        setEmail(res.data.email);      // Use email with lowercase 'e' (from backend)
        setUsername(res.data.username); // Use username with lowercase 'u' (from backend)
       
        
        toast.success('Login successful!');
        setTimeout(() => navigate('/candidate-dashboard'), 1500);
      } else {
        toast.warn('Not a candidate. Redirecting to register...');
        setTimeout(() => navigate('/register'), 2000);
      }
    } catch (err) {
      console.error(err);
      toast.error('Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="container d-flex align-items-center justify-content-center min-vh-100"
      style={{ backgroundColor: '#f1f4f8' }}
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="card p-4 shadow rounded-4"
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#ffffff',
          border: '1px solid #dee2e6',
        }}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-center mb-4" style={{ color: '#0d6efd' }}>
          Candidate Login
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="userName"
              className="form-control"
              placeholder="Enter username"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              onChange={handleChange}
              required
            />
          </div>
          <div className="d-grid mb-2">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          <p className="text-center text-muted mt-3 mb-0">
            Don't have an account?{' '}
            <span
              style={{ color: '#0d6efd', cursor: 'pointer' }}
              onClick={() => navigate('/register')}
            >
              Register here
            </span>
          </p>
          <p className="text-center text-muted mt-3 mb-0">
            Recruiter?{' '}
            <span
              style={{ color: '#0d6efd', cursor: 'pointer' }}
              onClick={() => navigate('/recruiter-login')}
            >
              Login here
            </span>
          </p>
        </form>
      </motion.div>
      <ToastContainer position="top-center" autoClose={2000} />
    </motion.div>
  );
};

export default CandidateLogin;
