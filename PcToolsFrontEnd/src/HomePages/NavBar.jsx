import React, { useContext, useEffect, useState } from 'react';
import logo from "../assets/imgs/newlogo.png";
import { AuthContext } from '../HeplersFunctions/CheckSCRFandAUTH';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import { Link } from 'react-router-dom';


const Navbar = () => {
    const { user, authenticated, fetchUserData, refreshUserData } = useContext(AuthContext);
    const [users, setUsers] = useState(null);


    useEffect(() => {
        if (user && authenticated) {
          setUsers(user);
        }else{
            refreshUserData();
        }
      }, [user,authenticated]);

      console.log('user nav',users)
  return (
    <nav className="flex items-center sm:justify-between flex-wrap justify-center px-7 md:px-20 xl:px-48 py-3 bg-gray-900 text-white">
      <div className="flex items-center mb-5 sm:m-0">
        <img src={logo} alt="Logo" className="w-40 cursor-pointer" />
      </div>
      <ul className="flex space-x-6">
        <li><Link to="/" className="font-semibold text-lg relative hover:after:content-[''] hover:after:absolute hover:after:w-full hover:after:h-[2px] hover:after:bg-white hover:after:bottom-[-2px] hover:after:left-0">Home</Link></li>
        <li><Link to="/about" className="font-semibold text-lg relative hover:after:content-[''] hover:after:absolute hover:after:w-full hover:after:h-[2px] hover:after:bg-white hover:after:bottom-[-2px] hover:after:left-0">About</Link></li>
        <li><Link to="/contact" className="font-semibold text-lg relative hover:after:content-[''] hover:after:absolute hover:after:w-full hover:after:h-[2px] hover:after:bg-white hover:after:bottom-[-2px] hover:after:left-0">Contact</Link></li>

        {
            authenticated === true && users ?
            (
                <li>
                    <Link to={`/profile/${users.id}`}>
                        <AccountCircleTwoToneIcon style={{ color: 'white', fontSize: 30 }} />
                    </Link>
                </li>
            )
            :
            (
                <li><Link to="/login" className="font-semibold text-lg relative hover:after:content-[''] hover:after:absolute hover:after:w-full hover:after:h-[2px] hover:after:bg-white hover:after:bottom-[-2px] hover:after:left-0">Login</Link></li>
            )
        }

      </ul>
    </nav>
  );
};

export default Navbar;
