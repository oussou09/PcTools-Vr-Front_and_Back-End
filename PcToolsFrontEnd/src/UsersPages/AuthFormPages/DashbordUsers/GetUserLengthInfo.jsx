import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation
import { AuthContext } from '../../../HeplersFunctions/CheckSCRFandAUTH';
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

const GetUserLengthInfo = () => {

    const { user, authenticated, loading } = useContext(AuthContext);
    const [users, setUsers] = useState(null);

    useEffect(() => {
      if (user && authenticated) {
        setUsers(user);
      }
    }, [user, authenticated]);


    if (!authenticated || !users) {
        return <div className="text-white">User not found or not authenticated</div>;  // Handle not authenticated case
        }

        console.log('Authenticated:', authenticated);
        console.log('User:', users);

  return (

        <div className="card-wrapper grid gap-6 mt-6 md:ml-6 md:mt-0">
        {/* Conditional My Cart / My Products */}
        {user.account_type === "0" ? (
            <div className='space-x-10'>
                <Link to={`/products/liked/${users.id}`}>
                <div className="card task-card flex items-center gap-5 p-6 bg-white rounded-lg shadow-md">
                    <div className="p-4 bg-red-200 rounded-md">
                    {/* <span className="material-symbols-rounded text-green-500">task_alt</span> */}
                        <FavoriteBorderOutlinedIcon style={{ color: 'black', fontSize: 30}} />
                    </div>
                    <div>
                    <data className="block text-xl font-bold text-gray-800">{users.likedProducts.length}</data>
                    <p className="text-gray-500">My Liked Products</p>
                    </div>
                </div>
                </Link>

                <Link to={`/cart/${users.id}`}>
                <div className="card task-card flex items-center gap-5 p-6 bg-white rounded-lg shadow-md">
                    <div className="p-4 bg-blue-100 rounded-md">
                    {/* <span className="material-symbols-rounded text-blue-500">drive_file_rename_outline</span> */}
                        <AddShoppingCartOutlinedIcon style={{ color: 'black', fontSize: 30}} />
                    </div>
                    <div>
                    <data className="block text-xl font-bold text-gray-800">
                        {users.UserCart}
                    </data>
                    <p className="text-gray-500">My Cart</p>
                    </div>
                </div>
                </Link>
            </div>
        ) : (
            <Link to={`/products/seller/${users.id}`}>
            <div className="card task-card flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
                <div className="p-4 bg-blue-100 rounded-md">
                {/* <span className="material-symbols-rounded text-blue-500">drive_file_rename_outline</span> */}
                <StorefrontTwoToneIcon style={{ color: 'black', fontSize: 30}} />
                </div>
                <div>
                {/* <data className="block text-xl font-bold text-gray-800">{users.products.length}</data> */}
                <data className="block text-xl font-bold text-gray-800">{users.products_count}</data>

                <p className="text-gray-500">My Products</p>
                </div>
            </div>
            </Link>
        )}
        </div>

  );
};

export default GetUserLengthInfo;
