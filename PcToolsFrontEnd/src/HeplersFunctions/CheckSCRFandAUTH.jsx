import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getCsrfToken } from './csrfTokenCheck';
import LoadingPage from './LoadingPage'; // Assuming you have a LoadingPage component

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [likedProductIds, setLikedProductIds] = useState(new Set());
  const [loading, setLoading] = useState(true); // Start with loading true for initial load

  // Function to fetch user data with loading state
  const fetchUserData = async () => {
    const token = Cookies.get('auth_user_token');
    console.log('Fetching user data...');
    console.log(`Authorization:,\n Bearer ${token}`);

    setLoading(true); // Show loading spinner during the initial data fetch

    if (token) {
      try {
        const csrfToken = await getCsrfToken();
        console.log('X-XSRF-TOKEN:', csrfToken);

        const response = await axios.get('http://localhost:8000/api/UserInfo', {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('User Info Response:', response.data);

        if (response.data && response.data.data) {
          const userData = response.data.data;
          setUser(userData); // Set user data from the response
          setAuthenticated(true);
          console.log('User data:', userData);

          // Initialize likedProductIds as a Set for fast lookup
          if (userData.likedProducts) {
            setLikedProductIds(new Set(userData.likedProducts.map(product => product.id)));
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setAuthenticated(false);
        setUser(null);
        setLikedProductIds(new Set()); // Clear liked products if error occurs
      }
    } else {
      console.log('No token found');
      setAuthenticated(false);
      setUser(null);
      setLikedProductIds(new Set()); // Clear liked products if no token
    }

    setLoading(false); // Stop loading after initial fetch
  };

  // Function to refresh user data without loading state
  const refreshUserData = async () => {
    const token = Cookies.get('auth_user_token');
    console.log('Refreshing user data...');

    if (token) {
      try {
        const csrfToken = await getCsrfToken();

        const response = await axios.get('http://localhost:8000/api/UserInfo', {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Refreshed User Info Response:', response.data);

        if (response.data && response.data.data) {
          const userData = response.data.data;
          setUser(userData); // Update user data without setting loading to true
          setAuthenticated(true);

          if (userData.likedProducts) {
            setLikedProductIds(new Set(userData.likedProducts.map(product => product.id)));
          }
        }
      } catch (error) {
        console.error('Error refreshing user:', error);
      }
    }
  };

  // UseEffect to call `fetchUserData` on component mount
  useEffect(() => {
    fetchUserData(); // Fetch user data on the initial mount
  }, []);

  // Show loading spinner if loading state is true
  if (loading) {
    return <LoadingPage />; // Show loading spinner until data is fetched
  }

  // Return the context provider with the fetched data and utility functions
  return (
    <AuthContext.Provider value={{ user, authenticated, likedProductIds, loading, fetchUserData, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
