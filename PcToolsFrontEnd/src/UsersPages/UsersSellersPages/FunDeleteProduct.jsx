// FunDeleteProduct.js

import axios from 'axios';
import Cookies from 'js-cookie';
import { getCsrfToken } from '../../HeplersFunctions/csrfTokenCheck'; // Import your CSRF helper function

export const FunDeleteProduct = async (selectedProductId) => {
  const token = Cookies.get('auth_user_token'); // Retrieve the token from cookies

  if (!token) {
    console.error("User is not authenticated.");
    return { error: "User not authenticated" };
  }

  try {
    const csrfToken = await getCsrfToken(); // Await the CSRF token

    const response = await axios.post('http://localhost:8000/api/delete-product', { selectedProductId } ,
        {
        withCredentials: true,
        headers: {
            'X-XSRF-TOKEN': csrfToken,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    return response.data;

  } catch (error) {
    console.error('Error during delete request:', error);
    return { error: error.message || "An error occurred" };
  }
};
