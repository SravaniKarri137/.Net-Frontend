import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import RecruiterLogin from './components/RecruiterLogin';
import CandidateLogin from './components/CandidateLogin';
import RecruiterDashboard from './components/RecruiterDashboard';
import CandidateDashboard from './components/CandidateDashboard';
import AddPosting from './components/AddPosting';
import ViewApplications from './components/ViewApplications';
import { UserProvider } from './components/UserContext';
import { JobProvider } from './components/JobContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddProfile from './components/AddProfile';
import Applyjobs from './components/Applyjobs';
import Dashboard from './components/Dashboard';
import Designjobs from './components/design';
import Sdjobs from './components/sdjobs';
import JobDetail from './components/JobDetails';
import Marketingjobs from './components/marketing';
import Jobapplicants from './components/Jobapplicants';
import TrackMyApplication from './components/TrackMyApplication';
import AllInterviewsPage from './components/AllInterviewsPage';


function App() {
  return (
    <JobProvider>
    <UserProvider>
    <Router>
      <Navbar />
      <Routes>
       
        <Route path="/" element={<Dashboard/>} />
        <Route path="/sd" element={<Sdjobs/>} />
        <Route path="/marketing" element={<Marketingjobs/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/design" element={< Designjobs />} />
        <Route path="/job/:id" element={<JobDetail />} />
        <Route path="/recruiter-login" element={<RecruiterLogin />} />
        <Route path="/candidate-login" element={<CandidateLogin />} />
        <Route path="/track" element={<TrackMyApplication />} />
        <Route path="/profile" element={<AddProfile/>} />
        <Route path="/apply" element={<Applyjobs/>} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
        <Route path="/add-posting" element={<AddPosting />} />
        <Route path="/all" element={<AllInterviewsPage />} />
       < Route path="/view-applications" element={<ViewApplications />} />
        <Route path="/view-applications/:id/applicants" element={<Jobapplicants />} />

      
      </Routes>
    </Router>
    </UserProvider>
    </JobProvider>
  );
}

export default App;
