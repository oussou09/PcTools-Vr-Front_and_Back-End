
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a Context for request tracking
const RequestTrackerContext = createContext();

// Custom hook to use the RequestTrackerContext
export const useRequestTracker = () => {
  return useContext(RequestTrackerContext);
};

// Provider component
export const RequestTrackerProvider = ({ children }) => {
  const [requestCount, setRequestCount] = useState(0);

  // Increment the request count each time a request is made
  const incrementRequestCount = () => {
    setRequestCount((prevCount) => prevCount + 1);
  };

  // Axios interceptor to track requests
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        incrementRequestCount(); // Increment request count
        console.log('Request sent to backend:', config.url);
        console.log(`Total requests sent: ${requestCount}`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Cleanup the interceptor when the component unmounts
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [requestCount]);

  return (
    <RequestTrackerContext.Provider value={{ requestCount }}>
      {children}
    </RequestTrackerContext.Provider>
  );
};
