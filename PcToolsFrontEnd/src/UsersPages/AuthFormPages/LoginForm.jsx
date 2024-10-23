import React, { useContext, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { getCsrfToken } from '../../HeplersFunctions/csrfTokenCheck';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate instead of browserHistory
import { AuthContext } from '../../HeplersFunctions/CheckSCRFandAUTH';
import { ProductsContext } from '../../HeplersFunctions/GetAllProducts';
import { SnakAlert, SnakAlertError } from '../../AlertMessage/SnakAlert';


const Login = () => {

    const { register, handleSubmit, formState: { errors }} = useForm();
    const navigate = useNavigate();  // Initialize the navigate hook
    const { refreshUserData } = useContext(AuthContext); // Get the fetch function from context
    const { refreshProducts } = useContext(ProductsContext);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isError, setIsError] = useState(false);



      // Function to handle form submission
      const onSubmit = async (data) => {
        const ValueDataContact = {
            email: data.email,
            password: data.password
        };

        try {
            const csrfToken = await getCsrfToken();

            const response = await axios.post('http://localhost:8000/api/login',ValueDataContact,
              {
                withCredentials: true,
                headers: {
                  'X-XSRF-TOKEN': csrfToken, // Attach CSRF token
                }
              }
            );

            // Check if token is present in the response
            if (response.data && response.data.token) {
              Cookies.set('auth_user_token', response.data.token, { expires: 7 });
              console.log('Token successfully stored:', response.data.token);

              // Fetch user and product data
              await refreshUserData();
              await refreshProducts();

              // Set success message
              setAlertMessage('Login successful!');  // Ensure this is a string
              setIsError(false);
              setAlertOpen(true);

              navigate('/products');  // Redirect user
            } else {
              console.error('Token not received. Response data:', response.data);
              setAlertMessage('Failed to log in. Please try again.');  // Ensure it's a string
              setIsError(true);
              setAlertOpen(true);
            }
          } catch (error) {
            // Detailed error logging
            console.error('Error posting data:', error.response ? error.response.data : error.message);
            setAlertMessage('Failed to login. Please check your credentials and try again.');  // Ensure it's a string
            setIsError(true);
            setAlertOpen(true);
          }
      };




  return (
    <div className="flex flex-col lg:flex-row justify-center items-center h-screen bg-gray-900">
      {/* Left section with animation */}
      <div className="w-full lg:w-2/5 flex justify-center items-center">
        <iframe
          className="w-4/5 lg:w-full h-64 lg:h-96"
          src="https://lottie.host/embed/7751e33a-7f7e-4a0a-af25-618bb001af07/YAwZzIUHeZ.json"
          title="Login Animation"
          frameBorder="0"
        ></iframe>
      </div>

      {/* Right section with login form */}
      <div className="w-full lg:w-3/5 flex justify-center items-center">
        <div className="bg-gray-600 p-10 rounded-lg shadow-lg w-4/5 lg:w-3/5">
          <h1 className="text-3xl text-teal-500 font-bold mb-8 text-center">LOGIN</h1>
          <form onSubmit={handleSubmit(onSubmit)} method="POST" className="flex flex-col">
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-200">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className="w-full p-3 mt-2 bg-gray-800 text-gray-200 rounded focus:outline-none border border-gray-600"
                {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && <p className="text-red-500 mt-2">{errors.email.message}</p>}
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-200">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                className="w-full p-3 mt-2 bg-gray-800 text-gray-200 rounded focus:outline-none border border-gray-600"
                {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 10, message: 'Password must be at least 6 characters long'},
                    maxLength: { value: 30, message: 'Password must be at most 30 characters long' },
                  })}
              />
              {errors.password && <p className="text-red-500 mt-2">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-teal-500 text-white rounded font-bold hover:bg-teal-400 transition"
            >
              Login
            </button>
            <div className="mt-4 text-center">
              <span className="text-white">Dont have an account? </span>
              <Link to="/register" className="text-teal-400 hover:underline">
                Register Now
              </Link>
            </div>
          </form>
        </div>
      </div>
          {/* Use the appropriate alert component based on the error state */}
    {isError ? (
        <SnakAlertError
            alertOpen={alertOpen}
            alertMessage={alertMessage}
            onClose={() => setAlertOpen(false)}
        />
    ) : (
        <SnakAlert
            alertOpen={alertOpen}
            alertMessage={alertMessage}
            onClose={() => setAlertOpen(false)}
        />
    )}
    </div>
  );
};

export default Login;
