import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RecruiterLogin = () => {
  const [credentials, setCredentials] = useState({ userName: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://localhost:7235/api/Auth/login', credentials);
      if (res.data.role === 'recruiter') {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('email', res.data.email);
        toast.success('Recruiter login successful!');
        setTimeout(() => navigate('/recruiter-dashboard'), 1500);
      } else {
        toast.warn('Not a recruiter account. Redirecting...');
        setTimeout(() => navigate('/candidate-login'), 2000);
      }
    } catch (err) {
      console.error(err);
      toast.error('Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="card p-4 shadow rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center text-success mb-4">Recruiter Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              className="form-control"
              name="userName"
              placeholder="Username"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Logging in...' : 'Login as Recruiter'}
            </button>
          </div>
          <p className="text-center text-muted mt-3">
            Don't have an account?{' '}
            <span
              style={{ color: '#198754', cursor: 'pointer' }}
              onClick={() => navigate('/register')}
            >
              Register here
            </span>
          </p>
        </form>
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </div>
  );
};

export default RecruiterLogin;
