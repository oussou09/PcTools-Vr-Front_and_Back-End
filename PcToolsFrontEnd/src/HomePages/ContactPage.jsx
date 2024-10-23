import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { SnakAlert, SnakAlertError } from '../AlertMessage/SnakAlert';
import { getCsrfToken } from '../HeplersFunctions/csrfTokenCheck';

const ContactPage = () => {
    const { register, handleSubmit, formState: { errors }, reset} = useForm();
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isError, setIsError] = useState(false);


      // Function to handle form submission
      const onSubmit = async (data) => {
        const ValueDataContact = {
          email: data.email,
          message: data.message
        };

        try {
          // Fetch the CSRF token only if it doesn't exist in cookies
          const csrfToken = await getCsrfToken();

          // Make the POST request with the CSRF token
          const response = await axios.post('http://localhost:8000/api/contact', ValueDataContact, {
            withCredentials: true,
            headers: {
              'X-XSRF-TOKEN': csrfToken, // Attach the CSRF token to the headers
            }
          });

          console.log('Form submitted:', response);
          reset();
          setAlertMessage(`Hello ${data.email}! We received your message successfully.`);
          setIsError(false);
          setAlertOpen(true);
        } catch (error) {
          console.error('Error posting data:', error);
          setAlertMessage(`Sorry ${data.email}! Failed to send your message.`);
          setIsError(true);
          setAlertOpen(true);
        }
      };


  return (
      <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto m-28 p-4 bg-gray-500 rounded shadow">
        <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto p-8 bg-gray-100 rounded shadow">

        <h1 className="text-3xl text-gray-900 font-bold text-center mb-6">Contact Us</h1>
        <form method='POST' onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name='email'
              id="email"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md text-gray-700"
              placeholder="email@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              })}
              required
            />
            {errors.email && <p className="text-red-500 mt-2">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name='message'
              id="message"
              className="mt-1 p-2 block w-full border border-gray-300 text text-gray-700 rounded-md"
              rows="5"
              placeholder="Your message..."
              {...register('message', {
                required: 'Message is required',
                minLength: {
                    value: 10,
                    message: 'Message must be at least 10 characters long',
                },
                maxLength: {
                    value: 200,
                    message: 'Message must be less than 200 characters',
                }
            })}
            />
            {errors.message && <p className="text-red-500 mt-2">{errors.message.message}</p>}
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md"
            >
              Send Message
            </button>
          </div>
        </form>
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

export default ContactPage;
