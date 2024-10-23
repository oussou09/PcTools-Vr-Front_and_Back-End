import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getCsrfToken } from './csrfTokenCheck';
import LoadingPage from './LoadingPage'; // Assuming this is your loading component

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch products from the API with loading state
  const fetchProductData = async () => {
    try {
      setLoading(true); // Show loading indicator
      const csrfToken = await getCsrfToken(); // Retrieve CSRF token if needed
      const response = await axios.get('http://localhost:8000/api/products', {
        withCredentials: true,
        headers: {
          'X-XSRF-TOKEN': csrfToken,
        },
      });
      setProduct(response.data);
      console.log('Products:', response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProduct(null);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Function to refresh products without showing the loading spinner
  const refreshProducts = async () => {
    try {
      const csrfToken = await getCsrfToken(); // Retrieve CSRF token if needed
      const response = await axios.get('http://localhost:8000/api/products', {
        withCredentials: true,
        headers: {
          'X-XSRF-TOKEN': csrfToken,
        },
      });
      setProduct(response.data); // Refresh the product data without loading state
    } catch (error) {
      console.error('Error refreshing products:', error);
      setProduct(null);
    }
  };

  // Fetch product data on component mount
  useEffect(() => {
    fetchProductData(); // Initial load with spinner
  }, []);

  // Main rendering logic
  if (loading) {
    return <LoadingPage />; // Display loading page only when loading
  }

  // Render the rest of the app after data is loaded
  return (
    <ProductsContext.Provider value={{ product , fetchProductData, refreshProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};
