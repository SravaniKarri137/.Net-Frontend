import React, { useEffect, useState } from "react";
import { useUserContext } from './UserContext';
import { motion } from "framer-motion";
import { FaPaperclip, FaCheckCircle, FaTimesCircle, FaEnvelope, FaTimes } from "react-icons/fa";

const TrackMyApplication = () => {
  const { email: userEmail } = useUserContext();
  const [email, setEmail] = useState(userEmail || "");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showInterview, setShowInterview] = useState(false);

  useEffect(() => {
    if (email) fetchApplicationsByEmail(email);
  }, [email]);

  const fetchApplicationsByEmail = async (email) => {
    try {
      const response = await fetch(`https://localhost:7235/api/JobApplication/applications/by-email?email=${email}`);
      if (!response.ok) throw new Error("Failed to fetch applications.");
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInterviewDetails = async (jobAppId) => {
    try {
      const response = await fetch(`https://localhost:7235/api/Interview/by-application/${jobAppId}`);
      if (!response.ok) throw new Error("Interview not found.");
      const data = await response.json();
      setSelectedInterview(data);
      setShowInterview(true);
    } catch (error) {
      console.error("Error fetching interview:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "selected":
        return "bg-success text-white";
      case "rejected":
        return "bg-danger text-white";
      case "on hold":
        return "bg-warning text-dark";
      case "under review":
        return "bg-info text-white";
      default:
        return "bg-secondary text-white";
    }
  };

  if (loading) return <div className="text-center mt-5">Loading your applications...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
  if (applications.length === 0) return <div className="text-center mt-5 text-muted">No applications found for this email.</div>;

  return (
    <div className="container my-5">
      <motion.div
        className="bg-white shadow-lg p-5 rounded-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h2
          className="text-center text-gradient mb-4 fw-bold"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          📍 Track My Applications
        </motion.h2>

        <div className="d-flex justify-content-center mb-4">
          <motion.input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control w-50"
            placeholder="Enter your email to track applications"
            whileFocus={{ scale: 1.05 }}
          />
        </div>

        <motion.div
          className="row g-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {applications.map((app) => (
            <motion.div
              key={app.id}
              className="col-md-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="border p-4 rounded-3 shadow-sm bg-light">
                <h5 className="text-dark fw-semibold">{app.jobTitle}</h5>
                <p><strong>Applied On:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span className={`badge ${getStatusColor(app.status)}`}>{app.status}</span></p>

                {app.status.toLowerCase() === 'rejected' ? (
                  <div className="text-danger d-flex align-items-center gap-2">
                    <FaTimesCircle /> <span>Sorry, your application was rejected.</span>
                  </div>
                ) : app.status.toLowerCase() === 'selected' ? (
                  <div
                    className="text-success d-flex align-items-center gap-2 cursor-pointer"
                    style={{ cursor: "pointer" }}
                    onClick={() => fetchInterviewDetails(app.id)}
                  >
                    <FaCheckCircle /> <span>Click to view your Interview Details</span>
                  </div>
                ) : (
                  <div className="d-flex align-items-center gap-2">
                    <FaPaperclip /> <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-info">View Resume</a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {showInterview && selectedInterview && (
          <motion.div
            className="mt-5 p-4 bg-white shadow rounded-3 border border-primary"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-primary">📅 Interview Details</h4>
              <button className="btn btn-sm btn-outline-danger" onClick={() => setShowInterview(false)}>
                <FaTimes /> Close
              </button>
            </div>
            <p><strong>Scheduled At:</strong> {new Date(selectedInterview.scheduledAt).toLocaleString()}</p>
            <p><strong>Interviewer:</strong> {selectedInterview.interviewer}</p>
            <p><strong>Mode:</strong> {selectedInterview.mode}</p>
            <p><strong>Status:</strong> <span className="badge bg-info text-white">{selectedInterview.status}</span></p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TrackMyApplication;
