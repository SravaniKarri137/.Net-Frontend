import React, { createContext, useState, useContext } from 'react';

// Create a context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [username, setUsername] = useState(localStorage.getItem("username"));

  return (
    <UserContext.Provider value={{ userId, setUserId, email, setEmail, username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use user context
export const useUserContext = () => useContext(UserContext);
