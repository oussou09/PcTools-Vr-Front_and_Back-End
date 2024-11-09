import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import { getCsrfToken } from '../../../HeplersFunctions/csrfTokenCheck';

const ModalComponent = ({ isOpen, onClose, modalType }) => {
  if (!isOpen) return null;
  const { register, handleSubmit, watch, formState: { errors }} = useForm();
  const navigate = useNavigate();


  const handleDeleteAcc = async () => {
    try {
        // Fetch CSRF token
        const csrfToken = await getCsrfToken();
        const token = Cookies.get('auth_user_token'); // Get user auth token

        console.log('token_csrf:', csrfToken, '\n', `Bearer ${token}`)

        // Make the logout request with the CSRF token
        const response = await axios.post(
            'http://localhost:8000/api/UserDelete',
            {},
            {
                withCredentials: true,
                headers: {
                    'X-XSRF-TOKEN': csrfToken,
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        console.log('response:', response.data);
        Cookies.remove('auth_user_token');
        navigate('/');
    } catch (error) {
        console.error('Error during :', error);
    }
    };

    const handleResetPassword = async (data) => {
        const DataResetPassword = {
            CurrentPassword: data.CurrentPassword,
            NewPassword1: data.NewPassword1,
            NewPassword2: data.NewPassword2
        };

        console.log('data:', DataResetPassword);

        try {
            // Fetch CSRF token
            const csrfToken = await getCsrfToken();
            const token = Cookies.get('auth_user_token'); // Get user auth token

            console.log('token_csrf:', csrfToken, '\n', `Bearer ${token}`)

            // Make the logout request with the CSRF token
            const response = await axios.post(
                'http://localhost:8000/api/ResetPassword',
                DataResetPassword,
                {
                    withCredentials: true,
                    headers: {
                        'X-XSRF-TOKEN': csrfToken,
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            console.log('response:', response.data);
            onClose();
        } catch (error) {
            console.error('Error during :', error);
        }
        };

  return (
    <div className="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto flex items-center justify-center">
      <div className="relative mx-auto shadow-xl rounded-md bg-white max-w-md p-6">
        {/* Close Button */}
        <div className="flex justify-between items-center mb-4">
        {modalType === "resetPassword" && (<h3 className="text-xl font-semibold text-black">Reset Your Password</h3>)}
        {modalType === "edit" && (<h3 className="text-xl font-semibold text-center text-black">Edit Your Info</h3>)}

          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 text-[25px]">
          <CloseIcon style={{ color: 'black', fontSize: '30px' }} />
          </button>
        </div>

        {/* Modal Content Based on modalType */}
        {modalType === "delete" && (
          <div className="text-center mx-10">
            <svg
              className="w-20 h-20 text-red-600 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="text-xl font-semibold mt-5 mb-6 text-black">
              Are you sure you want to delete your profile?
            </h3>
            <button
              onClick={() => {
                handleDeleteAcc();
                onClose();
              }}
              className="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg text-base px-4 py-2 mr-2"
            >
              Yes, Im sure
            </button>
            <button
              onClick={onClose}
              className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 font-medium rounded-lg text-base px-4 py-2"
            >
              No, cancel
            </button>
          </div>
        )}

        {modalType === "edit" && (
          <div className=' mx-10'>
            {/* Your edit form goes here */}
            <form method='POST'>
              {/* Example input */}
              <div className="mb-4">
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter your full name"
                />
              </div>
              {/* Save Changes Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
                >
                  Save Changes
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {modalType === "resetPassword" && (
          <div className='mx-7'>
            {/* Your reset password form goes here */}
            <form method='POST' onSubmit={ handleSubmit(handleResetPassword) }>
              {/* Example input */}
                <div className="relative w-80 mb-6 group">
                    <input
                        id='CurrentPassword'
                        name='CurrentPassword'
                        required
                        type="text"
                        className="block w-full appearance-none bg-transparent border-b border-gray-400 text-gray-800 py-2 px-1 focus:outline-none focus:ring-0 peer"
                        {...register('CurrentPassword', {
                            required: 'Current Password is required'
                        })}
                    />
                    {errors.CurrentPassword && <p className="text-red-500 mt-2">{errors.CurrentPassword.message}</p>}
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-200 ease-out peer-focus:w-1/2 peer-focus:left-0" />
                    <span className="absolute bottom-0 right-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-200 ease-out peer-focus:w-1/2 peer-focus:right-0" />
                    <label className="absolute left-1 text-gray-500 pointer-events-none transition-all duration-200 ease-out transform peer-focus:-top-5 peer-focus:text-blue-600 peer-focus:text-sm peer-valid:-top-5 peer-valid:text-blue-600 peer-valid:text-sm top-2">
                        Enter current password
                    </label>
                </div>
                {/* Example input */}
                <div className="relative w-80 mb-6 group">
                    <input
                        id='NewPassword1'
                        name='NewPassword1'
                        required
                        type="text"
                        className="block w-full appearance-none bg-transparent border-b border-gray-400 text-gray-800 py-2 px-1 focus:outline-none focus:ring-0 peer"
                        {...register('NewPassword1', {
                            required: 'New password is required',
                        })}
                    />
                    {errors.NewPassword1 && <p className="text-red-500 mt-2">{errors.NewPassword1.message}</p>}
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-200 ease-out peer-focus:w-1/2 peer-focus:left-0" />
                    <span className="absolute bottom-0 right-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-200 ease-out peer-focus:w-1/2 peer-focus:right-0" />
                    <label className="absolute left-1 text-gray-500 pointer-events-none transition-all duration-200 ease-out transform peer-focus:-top-5 peer-focus:text-blue-600 peer-focus:text-sm peer-valid:-top-5 peer-valid:text-blue-600 peer-valid:text-sm top-2">
                        Enter New password
                    </label>
                </div>
                <div className="relative w-80 mb-6 group">
                    <input
                        id='NewPassword2'
                        name='NewPassword2'
                        required
                        type="text"
                        className="block w-full appearance-none bg-transparent border-b border-gray-400 text-gray-800 py-2 px-1 focus:outline-none focus:ring-0 peer"
                        {...register('NewPassword2', {
                            required: 'Confirmation New Password is required',
                            validate: (value) => value === watch('NewPassword1') || 'Passwords do not match'
                        })}
                    />
                    {errors.NewPassword2 && <p className="text-red-500 mt-2">{errors.NewPassword2.message}</p>}
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-200 ease-out peer-focus:w-1/2 peer-focus:left-0" />
                    <span className="absolute bottom-0 right-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-200 ease-out peer-focus:w-1/2 peer-focus:right-0" />
                    <label className="absolute left-1 text-gray-500 pointer-events-none transition-all duration-200 ease-out transform peer-focus:-top-5 peer-focus:text-blue-600 peer-focus:text-sm peer-valid:-top-5 peer-valid:text-blue-600 peer-valid:text-sm top-2">
                        Confirme New password
                    </label>
                </div>
              {/* Confirm Reset Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded mr-2"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalComponent;
