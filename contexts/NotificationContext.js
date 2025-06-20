import React, { createContext, useState, useContext } from "react";
import NotificationComponent from "../components/NotificationComponent";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, duration = 5000) => {
    setNotification({ message, duration });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {/* {notification && (
        <NotificationComponent
          message={notification.message}
          duration={notification.duration}
          onClose={hideNotification}
        />
      )} */}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification deve ser usado dentro de um NotificationProvider"
    );
  }
  return context;
};
