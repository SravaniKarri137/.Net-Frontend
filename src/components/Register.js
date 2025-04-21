import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    email: '',
    role: 'candidate'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://localhost:7235/api/Auth/register', formData);
      toast.success('Registration successful!');
      setTimeout(() => {
        // Navigate based on role after registration success
        if (formData.role === 'candidate') {
          navigate('/candidate-login');
        } else if (formData.role === 'recruiter') {
          navigate('/recruiter-login');
        }
      }, 1500); // Delay navigation to show the success toast
    } catch (err) {
      console.error(err);
      toast.error('Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: '#f1f4f8' }}>
      <div className="card p-4 shadow rounded-4" style={{ maxWidth: '450px', width: '100%', backgroundColor: '#fff' }}>
        <h2 className="text-center text-primary mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              name="userName"
              className="form-control"
              placeholder="Username"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <div className="d-grid">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
          <p className="text-center text-muted mt-3">
            Already have an account?{' '}
            <span style={{ color: '#0d6efd', cursor: 'pointer' }} onClick={() => {
              if (formData.role === 'candidate') {
                navigate('/candidate-login');
              } else {
                navigate('/recruiter-login');
              }
            }}>
              Login here
            </span>
          </p>
        </form>
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </div>
  );
};

export default Register;
