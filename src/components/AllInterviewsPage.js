import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AllInterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const toLocalISOString = (utcDate) => {
    const date = new Date(utcDate);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  const formatDateTime = (utcDate) => {
    return new Date(utcDate).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCountdown = (scheduledAt) => {
    const diff = new Date(scheduledAt) - new Date();
    if (diff <= 0) return "Interview started or completed.";
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    return `${hours}h ${minutes}m remaining`;
  };

  useEffect(() => {
    axios.get('https://localhost:7235/api/Interview/all')
      .then(response => {
        setInterviews(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch interviews.');
        setLoading(false);
      });
  }, []);

  const handleEdit = (interview) => {
    setIsEditing(true);
    setSelectedInterview({ ...interview });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedInterview(null);
  };

  const handleUpdate = () => {
    const updatedInterview = {
      ...selectedInterview,
      scheduledAt: new Date(selectedInterview.scheduledAt).toISOString()
    };

    axios.put(`https://localhost:7235/api/Interview/${selectedInterview.id}`, updatedInterview)
      .then(response => {
        const updated = interviews.map(int =>
          int.id === response.data.id ? response.data : int
        );
        setInterviews(updated);
        setIsEditing(false);
        setSelectedInterview(null);
        alert('Interview updated successfully ✅');
      })
      .catch(() => {
        setError('Failed to update interview.');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedInterview(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date') {
      setDateFilter(value);
    } else if (name === 'status') {
      setStatusFilter(value);
    }
  };

  const filteredInterviews = interviews.filter(interview => {
    return (
      (interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (dateFilter ? new Date(interview.scheduledAt).toLocaleDateString() === new Date(dateFilter).toLocaleDateString() : true) &&
      (statusFilter ? interview.status === statusFilter : true)
    );
  });

  const paginateInterviews = filteredInterviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`container my-5 ${isDarkMode ? 'bg-dark text-light' : ''}`}>
      <h2 className="text-center mb-4 text-primary">📋 All Scheduled Interviews</h2>

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Interviewer..."
          className="form-control"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <input
          type="date"
          className="form-control"
          name="date"
          value={dateFilter}
          onChange={handleFilterChange}
        />
      </div>

      <div className="mb-4">
        <select
          className="form-select"
          name="status"
          value={statusFilter}
          onChange={handleFilterChange}
        >
          <option value="">All Status</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="mb-4">
        <button onClick={toggleDarkMode} className="btn btn-secondary">
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {paginateInterviews.map(interview => (
          <div key={interview.id} className="col">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title text-primary">{interview.interviewer}</h5>
                <p className="card-text">
                  <strong>Scheduled At:</strong> {formatDateTime(interview.scheduledAt)}<br />
                  <strong>Countdown:</strong> ⏳ {getCountdown(interview.scheduledAt)}<br />
                  <strong>Mode:</strong> {interview.mode}<br />
                  <strong>Status:</strong> {interview.status}<br />
                  <strong>Feedback:</strong> {interview.feedback}<br />

                  {interview.interviewNotes && (
                    <><strong>Notes:</strong> {interview.interviewNotes}<br /></>
                  )}
                  {interview.feedback && interview.feedback === 'Selected' && (
  <>
    <strong>Feedback:</strong> {interview.feedback}<br />
    <span className="badge mt-2 bg-success">
      Hired
    </span><br />
  </>
)}

                  <small className="text-muted">Application ID: {interview.jobApplicationId}</small>
                </p>
                <button
                  onClick={() => handleEdit(interview)}
                  className="btn btn-success btn-sm mt-2"
                >
                  ✏️ Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                Previous
              </button>
            </li>
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {isEditing && selectedInterview && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title">Edit Interview</h5>
                <button type="button" className="btn-close" onClick={handleCancelEdit}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Interviewer</label>
                    <input
                      type="text"
                      className="form-control"
                      name="interviewer"
                      value={selectedInterview.interviewer}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Scheduled At</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="scheduledAt"
                      value={toLocalISOString(selectedInterview.scheduledAt)}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mode</label>
                    <input
                      type="text"
                      className="form-control"
                      name="mode"
                      value={selectedInterview.mode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      name="status"
                      value={selectedInterview.status}
                      onChange={handleInputChange}
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Interview Notes</label>
                    <textarea
                      className="form-control"
                      name="interviewNotes"
                      value={selectedInterview.interviewNotes}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Feedback</label>
                    <textarea
                      className="form-control"
                      name="feedback"
                      value={selectedInterview.feedback}
                      onChange={handleInputChange}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleUpdate}>
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllInterviewsPage;
