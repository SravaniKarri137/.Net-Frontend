import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserTie, FaUser, FaUserPlus } from 'react-icons/fa';
import { useUserContext } from './UserContext'; // Assuming you are using context to manage login state

const Navbar = () => {
  const { userId, role } = useUserContext(); // Assuming the context includes userId and role
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logic to handle logout, like clearing localStorage and updating context
    localStorage.clear();
    navigate('/candidate-login'); // Navigate to the login page
  };

  // If the user's role is 'recruiter', return null (hide the navbar)
  if (role === 'recruiter') return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        <li className="nav-item">
          <Link className="nav-link text-dark fw-semibold" to="/">
            <FaUserTie className="me-1" />
            GetHired
          </Link>
        </li>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!userId ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-dark fw-semibold" to="/recruiter-login">
                    <FaUserTie className="me-1" />
                    Recruiter Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-dark fw-semibold" to="/candidate-login">
                    <FaUser className="me-1" />
                    Candidate Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-dark fw-semibold" to="/register">
                    <FaUserPlus className="me-1" />
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-dark fw-semibold" to="/track">
                    <FaUserPlus className="me-1" />
                    Track Your Application
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-dark fw-semibold" to="/candidate-dashboard">
                    <FaUser className="me-1" />
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-dark fw-semibold" to="/apply">
                    <FaUserPlus className="me-1" />
                    Apply Jobs
                  </Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-danger fw-semibold">
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
