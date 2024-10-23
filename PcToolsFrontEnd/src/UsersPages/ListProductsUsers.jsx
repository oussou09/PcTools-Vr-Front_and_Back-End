import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductsContext } from '../HeplersFunctions/GetAllProducts';
import LoadingPage from '../HeplersFunctions/LoadingPage';
import { AuthContext } from '../HeplersFunctions/CheckSCRFandAUTH';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Link } from 'react-router-dom';
import { FunctLikeDeslike } from '../UsersPages/UserBuyerPages/FunctLikeDeslike';
import { FuncAddCart } from './UserBuyerPages/FuncAddCart';
import { SnakAlert, SnakAlertError } from '../AlertMessage/SnakAlert';


const ProductCard = () => {
    const { product: allProducts, refreshProducts } = useContext(ProductsContext);
    const { user, authenticated, likedProductIds, refreshUserData } = useContext(AuthContext);
    const [visibleProducts, setVisibleProducts] = useState(20);
    const navigate = useNavigate();

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isError, setIsError] = useState(false);


    // Function to load more products
    const loadMoreProducts = () => {
        setVisibleProducts((prevVisible) => prevVisible + 10);
    };


    // Check if products exist
    const productsToRender = allProducts?.products?.slice(0, visibleProducts) || [];

    const handleLike = async (user_id, product_id) => {
        try {
            const response = await FunctLikeDeslike(user_id, product_id);
            if (response.error) {
                console.error(response.error);
                } else {
                    console.log('Reaction successful:', response);
                    await refreshUserData();
                    await refreshProducts();
          }
          } catch (error) {
              console.error('Error during like action:', error);
              }
    };

    const handleCart = async (navigate ,product_id) => {
        try {
            console.log("product send",navigate,product_id)
            const response = await FuncAddCart(navigate ,product_id);
            if (response.status === 409) {
                console.error("Error1", response.error);
                setAlertMessage(`Sorry ! ${response.message}.`);
                setIsError(true);
                setAlertOpen(true);
            } else {
                console.log('Add To cart Ha been successful:', response);
                await refreshUserData();
                await refreshProducts();
                setAlertMessage(`${response.message}.`);
                setIsError(false);
                setAlertOpen(true);
            }
        } catch (error) {
              console.error('Error during like action:', error);
              setAlertMessage(`Sorry ! ${error}.`);
              setIsError(true);
              setAlertOpen(true);
        }
    };




    return (
        <div className="p-4 mx-auto lg:max-w-7xl sm:max-w-full">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-xl:gap-4 gap-6">
                {productsToRender.map((product) => {
                    const isLiked = likedProductIds?.has(product.id);

                    return (
                        <div key={product.id} className="bg-gray-100 rounded-lg p-5 cursor-pointer hover:-translate-y-2 transition-all relative group">
                            <div className="absolute top-4 right-4 flex items-center space-x-3">
                                {/* Favorite icon based on like status */}
                                {authenticated && user?.account_type === "0" && (
                                    <div className="animate-fade-up opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out space-x-3">
                                        <form method="POST" onClick={(e) => { e.preventDefault(); handleLike(user.id, product.id); }}>
                                            <button>
                                                {isLiked ? (
                                                    <FavoriteSharpIcon style={{ color: 'red', fontSize: '34px' }} />
                                                ) : (
                                                    <FavoriteBorderOutlinedIcon style={{ color: 'black', fontSize: '34px' }} />
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* Edit/Delete for owner */}
                                {authenticated && product.user_id === user?.id && (
                                    <div className="animate-fade-up opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out space-x-3">
                                        <EditOutlinedIcon style={{ color: 'black', fontSize: '30px' }} />
                                        <DeleteOutlineOutlinedIcon style={{ color: 'black', fontSize: '30px' }} />
                                    </div>
                                )}

                                {/* Add to Cart */}
                                {authenticated && user?.account_type === "0" && (
                                    <form method="POST" onSubmit={(e) => { e.preventDefault(); handleCart(navigate,product.id)}}>
                                        <button type="submit">
                                            <AddShoppingCartOutlinedIcon style={{ color: 'black', fontSize: '30px' }} />
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* Product Link */}
                            <Link to={`/products/${product.Product_Title}/${product.id}`}>
                                <div className="w-5/6 h-[210px] overflow-hidden mx-auto aspect-w-16 aspect-h-8 mb-4">
                                    <img
                                        src={`http://localhost:8000/storage/${product.images[0].path}`}
                                        alt={product.Product_Title}
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-extrabold text-gray-800">
                                        {product.Product_Title.length > 50
                                            ? `${product.Product_Title.substring(0, 25)}...`
                                            : product.Product_Title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-2">
                                        {product.Product_Description.length > 50
                                            ? `${product.Product_Description.substring(0, 37)}...`
                                            : product.Product_Description}
                                    </p>
                                    <h4 className="text-lg text-gray-800 font-bold mt-4">{product.Product_Price} €</h4>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* Load More Button */}
            {visibleProducts < allProducts?.products?.length && (
                <button onClick={loadMoreProducts} className="load-more">
                    Load More
                </button>
            )}

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

export default ProductCard;
