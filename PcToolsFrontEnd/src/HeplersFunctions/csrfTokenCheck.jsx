import axios from 'axios';
import Cookies from 'js-cookie';

export const getCsrfToken = async () => {
  // Check if the XSRF-TOKEN already exists in cookies
  const csrfToken = Cookies.get('XSRF-TOKEN');

  // If the token exists, return it
  if (csrfToken) {
    // console.log('Using existing CSRF token:', csrfToken);
    return csrfToken;
  }

  // If the token does not exist, fetch it from the server
  console.log('Fetching new CSRF token...');
  await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });

  // After fetching, retrieve the new token from cookies
  const newCsrfToken = Cookies.get('XSRF-TOKEN');

  if (newCsrfToken) {
    // console.log('Fetched new CSRF token:', newCsrfToken);
    return newCsrfToken;
  } else {
    throw new Error('Failed to fetch CSRF token');
  }
};
