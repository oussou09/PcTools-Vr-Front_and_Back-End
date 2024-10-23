import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext } from '../../HeplersFunctions/CheckSCRFandAUTH';
import { getCsrfToken } from '../../HeplersFunctions/csrfTokenCheck';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Link } from 'react-router-dom';

const SellerUserProducts = () => {
  const [products, setProducts] = useState([]);
  const { user, authenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        const token = Cookies.get('auth_user_token');
        if (!token) throw new Error("Authorization token not found");

        const csrfToken = await getCsrfToken();

        const response = await axios.get('http://localhost:8000/api/UserProducts', {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-XSRF-TOKEN': csrfToken,
          },
          withCredentials: true,
        });

        if (response.data && response.data.status === 200) {
          setProducts(response.data.data);
          console.log(products)
        } else {
          console.error('Failed to load products:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching user products:', error);
      }
    };

    fetchUserProducts();
  }, []);

  if (!authenticated || !user) {
    return <div className="text-white">User not found or not authenticated</div>;
}

  return (
    <div className="p-4 mx-auto lg:max-w-7xl sm:max-w-full">
      <h2 className="text-white text-2xl mb-4">Your Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-xl:gap-4 gap-6">
        {products.map((product) => (
            <div
                key={product.id}
                className="bg-gray-100 rounded-lg p-5 cursor-pointer hover:-translate-y-2 transition-all relative group"
            >
                {/* Icons Container */}
                <div className="absolute top-4 right-4 flex items-center space-x-3">

                    {/* Show Edit and Delete icons if the product belongs to the logged-in user */}
                    {product.user_id === user.id && (
                    <>
                        <div className="animate-fade-up opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out space-x-3">
                            <EditOutlinedIcon style={{ color: 'black', fontSize: '30px' }} />
                            <DeleteOutlineOutlinedIcon style={{ color: 'black', fontSize: '30px' }} />
                        </div>
                        <Link to={`/products/${product.Product_Title}/${product.id}`}>
                            <VisibilityOutlinedIcon style={{ color: 'black', fontSize: '30px' }} />
                        </Link>
                    </>
                    )}

                </div>

                {/* Image Box */}
                <div className="w-5/6 h-[210px] overflow-hidden mx-auto aspect-w-16 aspect-h-8 mb-4">
                {product.images && product.images.length > 0 ? (
                    <img
                    src={`http://localhost:8000/storage/${product.images[0].path}`}
                    alt={product.Product_Title}
                    className="h-full w-full object-contain"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500">
                    No Image Available
                    </div>
                )}
                </div>

                {/* Content Box */}
                <div>
                    <h3 className="text-lg font-extrabold text-gray-800">{product.Product_Title}</h3>
                    <p className="text-gray-600 text-sm mt-2">
                        {product.Product_Description.length > 50
                            ? `${product.Product_Description.substring(0, 37)}...`
                            : product.Product_Description}
                    </p>
                    <h4 className="text-lg text-gray-800 font-bold mt-4">{product.Product_Price} €</h4>
                </div>
            </div>
        ))}
    </div>
    </div>
  );
};

export default SellerUserProducts;
