import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../HeplersFunctions/CheckSCRFandAUTH';
import newlogo from '../../../assets/imgs/newlogo.png';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import StoreTwoToneIcon from '@mui/icons-material/StoreTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LoginTwoToneIcon from '@mui/icons-material/LoginTwoTone';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { getCsrfToken } from '../../../HeplersFunctions/csrfTokenCheck';

const Navigation = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false); // For mobile menu
  const { user, authenticated } = useContext(AuthContext);
  const [users, setUsers] = useState(null);
  const navigate = useNavigate();  // Initialize the navigate hook


  useEffect(() => {
    if (user && authenticated) {
      setUsers(user);
    }
  }, [user, authenticated]);

//   if (!authenticated || !users) {
//     return <div className="text-white">User not found or not authenticated</div>;
//   }


  // Toggle the mobile menu for mobile view
  const handleMobileMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
  };

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            // Fetch CSRF token
            const csrfToken = await getCsrfToken();
            const token = Cookies.get('auth_user_token'); // Get user auth token

            console.log('token_csrf:', csrfToken, '\n', `Bearer ${token}`)

            // Make the logout request with the CSRF token
            const response = await axios.post(
                'http://localhost:8000/api/UserLogout',
                {},
                {
                    withCredentials: true,
                    headers: {
                        'X-XSRF-TOKEN': csrfToken,
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            console.log('Logout response:', response.data);
            Cookies.remove('auth_user_token');
            navigate('/');
            navigate(0);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    console.log("user",user,"\n","users",users)


  return (
    <div className="w-full h-auto bg-gray-800">
      <div className="flex items-center justify-between px-4 md:px-16 py-4">
        {/* Logo */}
        <div className="logo">
          <img className="h-10 w-32 lg:h-12 lg:w-36" src={newlogo} alt="Logo" />
        </div>

        {/* Navigation Menu for Desktop and Mobile */}
        <nav className={`md:flex ${showMobileMenu ? 'block' : 'hidden'} w-full md:w-auto`}>
          <ul className="flex flex-row md:space-x-8 items-center text-white">
            {/* Home Link */}
            <li className="relative group">
              <Link to="/" className="flex items-center hover:bg-gray-700 p-3 rounded-md">
                Home
                <HomeTwoToneIcon style={{ color: 'white', fontSize: 30, marginLeft: '5px' }} />
              </Link>
            </li>

            {/* Auth Links */}
            {(!authenticated || !users) ? (
              <li className="relative group">
                <Link to="/login" className="flex items-center hover:bg-gray-700 p-3 rounded-md">
                  Login
                  <LoginTwoToneIcon style={{ color: 'white', fontSize: 30, marginLeft: '5px' }} />
                </Link>
              </li>
            ) : (
            <>
            {/* Seller / Buyer Section */}
            {users?.account_type === "0" ? (
                <>
                <li className="relative group">
                    <Link to="/products" className="flex items-center hover:bg-gray-700 p-3 rounded-md">
                    Product
                    <StoreTwoToneIcon style={{ color: 'white', fontSize: 30, marginLeft: '5px' }} />
                    </Link>
                </li>

                {/* Cart Section */}
                <li className="relative group">
                    <Link
                    to={`/cart/${users?.id}`}
                    className="flex items-center hover:bg-gray-700 p-3 rounded-md relative"
                    >
                    <ShoppingCartTwoToneIcon style={{ color: 'white', fontSize: 30, marginLeft: '5px' }} />
                    <span className="absolute -bottom-2 -right-2 rounded-full bg-red-500 text-white px-2 text-sm font-bold">
                        {/* 10 */}
                        {users.UserCart}
                    </span>
                    </Link>
                </li>
                </>
            ) : (
                <li className="relative group">
                <div className="flex items-center hover:bg-gray-700 p-3 rounded-md cursor-pointer">
                    <Link to="/products" className="flex items-center">
                    Product
                    <StoreTwoToneIcon style={{ color: 'white', fontSize: 30, marginLeft: '5px' }} />
                    </Link>
                </div>
                <ul className="absolute left-0 top-full w-full bg-gray-900 text-white rounded-md hidden group-hover:block z-50">
                    <li className="hover:bg-gray-700">
                    <Link to="/products/create" className="block px-4 py-2">
                        Add Product
                    </Link>
                    </li>
                    <li className="hover:bg-gray-700">
                    <Link to={`/products/seller/${users?.id}`} className="block px-4 py-2">
                        My Products
                    </Link>
                    </li>
                </ul>
                </li>
            )}

            {/* Profile Section */}
            <li className="relative group">
                <Link to={`/profile/${users?.id}`} className="flex items-center hover:bg-gray-700 p-3 rounded-md">
                Profile
                <AccountCircleTwoToneIcon style={{ color: 'white', fontSize: 30, marginLeft: '5px' }} />
                </Link>
                <ul className="absolute left-0 top-full w-32 bg-gray-900 text-white rounded-md hidden group-hover:block z-50">
                <li className="hover:bg-gray-700">
                    <form method="POST" onSubmit={handleLogout} className="flex items-center px-4 py-2">
                    <button type="submit" className="cursor-pointer text-white">
                        Logout
                        <LogoutTwoToneIcon style={{ color: 'white', fontSize: 30, marginLeft: '5px' }} />
                    </button>
                    </form>
                </li>
                </ul>
            </li>
            </>
        )}
        </ul>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button className="text-white md:hidden" onClick={handleMobileMenuToggle}>
          {showMobileMenu ? <CloseIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
        </button>
      </div>
    </div>
  );
};

export default Navigation;
