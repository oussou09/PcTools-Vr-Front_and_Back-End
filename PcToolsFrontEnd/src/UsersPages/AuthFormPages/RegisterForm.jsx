
import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { getCsrfToken } from '../../HeplersFunctions/csrfTokenCheck';
import { useNavigate } from 'react-router-dom'; // useNavigate instead of browserHistory


const Register = () => {


    const { register, handleSubmit, formState: { errors }} = useForm();
    const navigate = useNavigate();  // Initialize the navigate hook



      // Function to handle form submission
      const onSubmit = async (data) => {
        const ValueDataContact = {
            fullname: data.fullname,
            email: data.email,
            account_type: data.account_type,
            password: data.password
        };

        try {
          // Fetch the CSRF token only if it doesn't exist in cookies
          const csrfToken = await getCsrfToken();

          // Make the POST request with the CSRF token
          const response = await axios.post('http://localhost:8000/api/register', ValueDataContact, {
            withCredentials: true,
            headers: {
              'X-XSRF-TOKEN': csrfToken, // Attach the CSRF token to the headers
            }
          });

          console.log('Form submitted:', response);
          navigate('/login');

        } catch (error) {
            console.log('Form submitted:', ValueDataContact);
          console.error('Error posting data:', error);
        }
      };



  return (
    <div className="flex flex-col lg:flex-row justify-center items-center h-screen bg-gray-900">
      {/* Left section with animation */}
      <div className="w-full lg:w-2/5 flex justify-center items-center">
        <iframe
          className="w-4/5 lg:w-full h-64 lg:h-96"
          src="https://lottie.host/embed/7751e33a-7f7e-4a0a-af25-618bb001af07/YAwZzIUHeZ.json"
          title="Register Animation"
          frameBorder="0"
        ></iframe>
      </div>

      {/* Right section with register form */}
      <div className="w-full lg:w-3/5 flex justify-center items-center">
        <div className="bg-gray-700 p-10 rounded-lg shadow-lg w-4/5 lg:w-3/5">
          <h1 className="text-3xl text-teal-300 font-bold mb-8 text-center">Register</h1>
          <form method="POST" onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-200">Username</label>
              <input
                type="text"
                name="fullname"
                id="fullname"
                placeholder="Fullname"
                className="w-full p-3 mt-2 bg-gray-800 text-gray-200 rounded focus:outline-none border border-gray-600"
                {...register('fullname', {
                required: 'Full name is required',
                maxLength: {
                    value: 20,
                    message: 'Full name must be less than 20 characters',
                },
                })}
              />
              {errors.fullname && <p className="text-red-500 mt-2">{errors.fullname.message}</p>}
            </div>
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
            <div className="mb-4">
              <label htmlFor="role" className="block text-gray-200">Role: As a?</label>
              <select
                id="role"
                name="account_type"
                className="w-full p-3 bg-gray-800 text-gray-200 rounded border border-gray-600"
                {...register('account_type', {
                    required: 'Account type is required',
                  })}
                 >
                {errors.account_type && <p className="text-red-500 mt-2">{errors.account_type.message}</p>}
                <option value="0">Buyer</option>
                <option value="1">Seller</option>
              </select>
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
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long',
                    },
                  })}
              />
              {errors.password && <p className="text-red-500 mt-2">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-teal-500 text-white rounded font-bold hover:bg-teal-400 transition"
            >
              Register
            </button>
            <div className="mt-4 text-center">
              <span className="text-white">Already have an account? </span>
              <a href="/login" className="text-teal-400 hover:underline">
                Login Now
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
