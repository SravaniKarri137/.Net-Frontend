import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-message text-center">
        <h1>Welcome to GetHired!</h1>
        <p className="motivational-text">The future belongs to those who prepare for it today.</p>
        <button onClick={() => navigate('/candidate-login')} className="btn btn-success btn-lg">Get Started - Sign In</button>
      </div>

      {/* Job Categories Section */}
      <div className="job-categories my-5">
        <h2 className="text-center">Explore Top Categories</h2>
        <div className="row">
          <div className="col-md-4 category-card">
            <div className="category-box">
              <h3>Software Development</h3>
              <p>Find the best internships and jobs in software development.</p>
              <button onClick={() => navigate('/sd')} className="btn btn-primary">Browse</button>
            </div>
          </div>
          <div className="col-md-4 category-card">
            <div className="category-box">
              <h3>Marketing & Sales</h3>
              <p>Discover opportunities in marketing and sales.</p>
              <button onClick={() => navigate('/marketing')} className="btn btn-primary">Browse</button>
            </div>
          </div>
          <div className="col-md-4 category-card">
            <div className="category-box">
              <h3>Design & Creative</h3>
              <p>Explore internships in design, UI/UX, and creativity.</p>
              <button onClick={() => navigate('/design')} className="btn btn-primary">Browse</button>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Internships Section */}
      <div className="trending-internships my-5">
        <h2 className="text-center">Trending Internships</h2>
        <div className="row">
          <div className="col-md-4 internship-card">
            <div className="internship-box">
              <h4>Software Engineering Internship</h4>
              <p>Location: Remote | Stipend: $1000/month</p>
              <button onClick={() => navigate('/apply')} className="btn btn-info">Apply Now</button>
            </div>
          </div>
          <div className="col-md-4 internship-card">
            <div className="internship-box">
              <h4>Digital Marketing Internship</h4>
              <p>Location: Mumbai | Stipend: $800/month</p>
              <button onClick={() => navigate('/apply')} className="btn btn-info">Apply Now</button>
            </div>
          </div>
          <div className="col-md-4 internship-card">
            <div className="internship-box">
              <h4>Graphic Design Internship</h4>
              <p>Location: Bangalore | Stipend: $600/month</p>
              <button onClick={() => navigate('/apply')} className="btn btn-info">Apply Now</button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="additional-info my-5">
        <h2 className="text-center">Why Choose GetHired?</h2>
        <p className="text-center">GetHired connects you with top recruiters and companies offering amazing opportunities. Start your career journey today!</p>
      </div>
    </div>
  );
};

export default Dashboard;
