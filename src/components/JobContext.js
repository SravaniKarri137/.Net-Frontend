import React, { createContext, useContext, useState } from "react";

const JobContext = createContext();

export const useJobContext = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
  const [jobPostingId, setJobPostingId] = useState(null);

  return (
    <JobContext.Provider value={{ jobPostingId, setJobPostingId }}>
      {children}
    </JobContext.Provider>
  );
};
