import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation
import { AuthContext } from '../../../HeplersFunctions/CheckSCRFandAUTH';

const Sidebar = () => {

    const { user, authenticated, loading } = useContext(AuthContext);
    const [users, setUsers] = useState(null);

    useEffect(() => {
      if (user && authenticated) {
        setUsers(user);
      }
    }, [user, authenticated]);

    console.log('User:', users);
    console.log('Authenticated:', authenticated);

    if (!authenticated || !users) {
        return <div className="text-white">User not found or not authenticated</div>;  // Handle not authenticated case
      }


  return (
    <div className="sidebar p-5 relative bg-black bg-opacity-60 border border-opacity-60 shadow-lg backdrop-blur-lg z-0">
      <ul>
        <li>
          <Link
            className="flex items-center text-sm rounded-md p-2 hover:bg-gray-700 hover:text-white transition-colors"
            to="/dashboard" // or route('user.dashborduser') if using Inertia.js or other Laravel stack
          >
            <i className="fa-regular fa-chart-bar mr-3"></i>
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            className="flex items-center text-sm rounded-md p-2 bg-gray-700 text-white"
            to={`/profile/${user.id}`} // or route('user.profileuser', {id: user.id}) if using Laravel Inertia.js
          >
            <i className="fa-regular fa-user mr-3"></i>
            <span>Profile</span>
          </Link>
        </li>
        <li>
          <Link
            className="flex items-center text-sm rounded-md p-2 hover:bg-gray-700 hover:text-white transition-colors"
            to={`/edit/${user.id}`} // or route('user.edituser', {id: user.id})
          >
            <i className="fa-solid fa-gear mr-3"></i>
            <span>Settings</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
