import React, { useEffect, useState } from "react";
import { useUserContext } from './UserContext';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserEdit, FaSave, FaTimes, FaPhone, FaEnvelope, FaCode } from "react-icons/fa";

const CandidateDashboard = () => {
  const { userId } = useUserContext();
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) fetchCandidateInfo();
    else navigate("/login");
  }, [userId]);

  const fetchCandidateInfo = async () => {
    try {
      const response = await fetch(`https://localhost:7235/api/profile/user/${userId}`);
      if (response.status === 404) return navigate("/profile");

      const data = await response.json();
      if (!data || Object.keys(data).length === 0) return navigate("/profile");

      setCandidateInfo(data);
      fetchApplications(data.email); // 👈 Fetch applications after getting profile info
    } catch (error) {
      console.error("Error fetching candidate info:", error);
      alert("Error fetching candidate info.");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (email) => {
    try {
      const response = await fetch(`https://localhost:7235/api/JobApplication/applications/by-email?email=${email}`);
      console.log("Response status:", email);
      if (!response.ok) throw new Error("No applications found.");

      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.warn("No applications or error fetching:", error.message);
      setApplications([]);
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://localhost:7235/api/profile/${candidateInfo.profileId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidateInfo),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        setIsEditing(false);
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating candidate info:", error);
      alert("Error updating candidate info.");
    }
  };

  const handleChange = (e) => {
    setCandidateInfo({ ...candidateInfo, [e.target.name]: e.target.value });
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

  if (loading) return <div className="text-center mt-5">Loading your personalized dashboard...</div>;
  if (!candidateInfo) return <div className="text-center mt-5">No candidate info available.</div>;

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
          🎯 Candidate Dashboard — Welcome {candidateInfo.fullName}
        </motion.h2>

        <div className="row g-4">
          {/* Full Name */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                className="form-control shadow-sm"
                value={candidateInfo.fullName}
                onChange={handleChange}
              />
            ) : (
              <div className="d-flex align-items-center gap-2">
                <FaUserEdit className="text-primary" />
                <span>{candidateInfo.fullName}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Email</label>
            <div className="d-flex align-items-center gap-2">
              <FaEnvelope className="text-success" />
              <span>{candidateInfo.email}</span>
            </div>
          </div>

          {/* Phone */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Phone</label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                className="form-control shadow-sm"
                value={candidateInfo.phone}
                onChange={handleChange}
              />
            ) : (
              <div className="d-flex align-items-center gap-2">
                <FaPhone className="text-warning" />
                <span>{candidateInfo.phone}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Skills</label>
            {isEditing ? (
              <textarea
                name="skills"
                className="form-control shadow-sm"
                rows="3"
                value={candidateInfo.skills}
                onChange={handleChange}
                placeholder="e.g., Java, React, Python"
              />
            ) : (
              <div className="d-flex align-items-start gap-2">
                <FaCode className="text-info mt-1" />
                <span>{candidateInfo.skills}</span>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <motion.div
          className="text-end mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {isEditing ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpdate}
                className="btn btn-success me-2 px-4 shadow-sm"
              >
                <FaSave className="me-1" /> Save
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(false)}
                className="btn btn-outline-secondary px-4"
              >
                <FaTimes className="me-1" /> Cancel
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="btn btn-primary px-4 shadow"
            >
              <FaUserEdit className="me-2" /> Edit Profile
            </motion.button>
          )}
        </motion.div>
      </motion.div>

      {/* Track My Applications Section */}
      <motion.div
        className="bg-light p-4 mt-5 rounded-4 shadow-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h4 className="mb-4 fw-bold text-primary">📍 Track My Applications</h4>

        {loadingApplications ? (
          <p>Loading applications...</p>
        ) : applications.length === 0 ? (
          <p className="text-muted">You haven’t applied to any jobs yet.</p>
        ) : (
          <div className="row g-4">
            {applications.map((app) => (
              <motion.div
                key={app.id}
                className="col-md-6"
                whileHover={{ scale: 1.02 }}
              >
                <div className="border p-3 rounded-3 shadow-sm bg-white">
                  <h5 className="text-dark fw-semibold">{app.jobTitle}</h5>
                  <p className="mb-1"><strong>Applied On:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
                  <p className="mb-1"><strong>Status:</strong> <span className={`badge ${getStatusColor(app.status)}`}>{app.status}</span></p>
                  <a href={app.resumeUrl} className="btn btn-sm btn-outline-primary mt-2" target="_blank" rel="noreferrer">
                    View Resume
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CandidateDashboard;
