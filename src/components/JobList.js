// src/components/JobList.js
import React from "react";

const JobList = ({ jobs, onBack }) => {
  return (
    <div>
      <h3>Posted Jobs</h3>
      {jobs.length === 0 ? (
        <p>No job postings available.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <strong>{job.title}</strong> - {job.department} <br />
              Location: {job.location}, Salary: ₹{job.salary} <br />
              Type: {job.jobType}, Deadline: {job.deadline}
              <hr />
            </li>
          ))}
        </ul>
      )}
      <button onClick={onBack}>Back</button>
    </div>
  );
};

export default JobList;
