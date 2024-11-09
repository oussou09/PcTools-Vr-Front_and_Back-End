import React, { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import { useParams } from 'react-router-dom';
import { ProductsContext } from '../HeplersFunctions/GetAllProducts';
import LoadingPage from '../HeplersFunctions/LoadingPage';
import { AuthContext } from '../HeplersFunctions/CheckSCRFandAUTH';
import { getCsrfToken } from '../HeplersFunctions/csrfTokenCheck';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp';
import { useNavigate } from 'react-router-dom'; // useNavigate instead of browserHistory
import NotFoundPage404 from '../errors/NotFoundPage404';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { FunctLikeDeslike } from '../UsersPages/UserBuyerPages/FunctLikeDeslike';
import { FuncAddCart } from './UserBuyerPages/FuncAddCart';



const ProductDetails = () => {
    const { product: contextProducts, loading: contextLoading, likedProductIds, refreshProducts } = useContext(ProductsContext);
    const { user, authenticated, fetchUserData, refreshUserData } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    const [quantity, setQuantity] = useState(1);

    const handleIncrease = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const handleDecrease = () => {
        setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : prevQuantity));
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true); // Set loading state
            try {
                if (!id) throw new Error("Product ID not found");

                // Check if the product is already in context
                const productInContext = contextProducts?.products?.find(prod => prod.id === parseInt(id));
                if (productInContext) {
                    setProduct(productInContext);
                    setLoading(false); // Loading complete, no need for backend fetch
                    return;
                }

                // If not found in context, fetch from backend
                const csrfToken = await getCsrfToken();
                const response = await axios.get(`http://localhost:8000/api/product-Details`, {
                    params: { id },
                    headers: {
                        'X-XSRF-TOKEN': csrfToken,
                    },
                    withCredentials: true,
                });

                if (response.data && response.data.status === 200) {
                    const fetchedProduct = response.data.data[0]; // Get product data from response
                    setProduct(fetchedProduct);
                } else {
                    console.error('Failed to load product:', response.data?.message || 'No message provided');
                    navigate('/404');
                }
            } catch (error) {
                console.error('Error fetching product details:', error.message || error);
                navigate('/404');
            } finally {
                setLoading(false); // End loading state
            }
        };

        // Only fetch if not already loading from context
        if (!contextLoading) {
            fetchProductDetails();
        }
}, [id, contextProducts, navigate]); // Modified dependency array to reduce re-renders


    const isLiked = product ? likedProductIds?.has(product.id) : false;
    console.log('isLiked', isLiked ,'\n product:',product)

    const handleLike = async (user_id, product_id) => {
        console.log('begin work')
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

    const handleCart = async (navigate , product_id, quantity ) => {
        try {
            console.log("product send",navigate, product_id, quantity)
            const response = await FuncAddCart(navigate, product_id, quantity);
            if (response.error) {
                console.error(response.error);
                } else {
                    console.log('Reaction successful:', response);
                    await fetchUserData();
                    await refreshProducts();
          }
          } catch (error) {
              console.error('Error during like action:', error);
              }
    };


    if (loading || contextLoading) return <LoadingPage />;
    if (!product) return <NotFoundPage404 />;

    // console.log(product)
    console.log(user)



return (
    <div className="font-sans tracking-wide max-md:mx-auto mt-10 pb-10 lg:pb-0">
    <div className="rounded-lg mx-6 bg-gradient-to-r from-gray-600 via-gray-900 to-gray-900 md:min-h-[600px] grid items-start grid-cols-1 lg:grid-cols-5 md:grid-cols-2">

        {/* Image Section */}
        <div className="lg:col-span-3 h-auto p-8">
            <div className="relative flex items-center justify-center">
                {/* Wrapper around Swiper with a fixed width */}
                {product.images.length>0 ? (
                    <div className="max-w-[600px] w-full mx-auto">
                        <Swiper
                        cssMode={true}
                        navigation={true}
                        pagination={true}
                        mousewheel={true}
                        keyboard={true}
                        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                        className="mySwiper"
                    >

                        {product.images.map((image, index) => (
                            <SwiperSlide key={index}>
                                    <img
                                        src={`http://localhost:8000/storage/${image.path}`}
                                        alt="Product"
                                        className="w-full h-full object-contain mx-auto"
                                    />
                            </SwiperSlide>
                        ))}
                        </Swiper>
                    </div>
                ) : (
                    <div className="w-full mx-auto flex justify-center items-center">
                        <BrokenImageIcon className='lg:mt-10' style={{ color: 'white', width: '100%', maxWidth: '400px', height: 'auto', }} />
                    </div>
                )}
            </div>
        </div>


        {/* Details Section */}
        <div className="rounded-b-lg lg:rounded-l-none lg:rounded-r-lg lg:col-span-2 bg-gray-100 py-6 px-8 h-full">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">{product.Product_Title}</h2>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-800">Price</h3>
                <p className="text-gray-800 text-3xl font-bold mt-4">{product.Product_Price}</p>
            </div>

            {authenticated && user && (
            <>
                <div className={`mt-8 ${user?.account_type === "1" ? "opacity-50 cursor-not-allowed" : ""}`} disabled={user.account_type === "1"}>
                    <h3 className="text-lg font-bold text-gray-800">Quantity</h3>
                    <div className="flex divide-x border w-max mt-4 rounded overflow-hidden">
                        <button type="button" onClick={handleDecrease} className="bg-gray-100 w-10 h-9 font-semibold flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-current inline" viewBox="0 0 124 124">
                                <path d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z" data-original="#000000"></path>
                            </svg>
                        </button>
                        <button type="button" className="bg-transparent w-10 h-9 font-semibold flex items-center justify-center text-gray-800 text-lg">
                            {quantity}
                        </button>
                        <button type="button" onClick={handleIncrease} className="bg-gray-800 text-white w-10 h-9 font-semibold flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-current inline" viewBox="0 0 42 42">
                                <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" data-original="#000000"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                    <button type="button" disabled={user?.account_type === "1"} className={`min-w-[200px] px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded  ${user.account_type === "1" ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={(e) => { e.preventDefault(); handleCart(navigate , product.id ,quantity); }}>
                        Add to cart
                    </button>
                    <div disabled={user?.account_type === "1"} className={`relative inline-flex items-center w-[136px] h-12 bg-gray-800 rounded-lg shadow-lg  ${user.account_type === "1" ? "opacity-50 cursor-not-allowed" : ""}`}>
                        {/* Like Button */}
                        <input
                            type="checkbox"
                            id="heart"
                            className="hidden"
                            checked={isLiked}
                            onChange={() => handleLike(user?.id, product.id)}
                        />
                        <label htmlFor="heart" className="flex items-center justify-center w-2/3 cursor-pointer">
                            {isLiked ? (
                                <FavoriteSharpIcon className="text-red-500 transition-transform transform scale-125" fontSize="large" />
                            ) : (
                                <FavoriteBorderOutlinedIcon className="text-gray-400 transition-transform" fontSize="large" />
                            )}
                            <span className="ml-2 text-gray-200 text-base font-medium">Like</span>
                        </label>

                        {/* Like Count */}
                        <div
                            className={`w-1/3 flex items-center justify-center text-base font-semibold border-l border-gray-600 transition-transform ${isLiked ? 'text-white' : 'text-gray-500'}`}
                        >
                            {isLiked ? product.likes_count + 1 : product.likes_count}
                        </div>
                    </div>

                    {/* <button type="button"
                    onClick={(e) => { e.preventDefault(); handleLike(user?.id, product.id); }}
                    disabled={user?.account_type === "1"} className={`min-w-[200px] px-4 py-2.5 border border-gray-800 bg-transparent hover:bg-gray-50 text-gray-800 text-sm font-semibold rounded  ${user.account_type === "1" ? "opacity-50 cursor-not-allowed" : ""}`}>
                        {isLiked ? (
                            <FavoriteSharpIcon style={{ color: 'red', fontSize: '30px' }} />
                        ) : (
                            <FavoriteBorderOutlinedIcon style={{ color: 'black', fontSize: '30px' }} />
                        )}
                    </button> */}
                </div>
            </>
            )}

            <div className="flex flex-wrap items-center text-sm text-gray-800 mt-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="fill-current w-6 mr-3" viewBox="0 0 48 48">
                    <path d="M15.5 33.3h19.1v2H15.5z" data-original="#000000" />
                    <path d="M45.2 35.3H43v-2h2.2c.4 0 .8-.4.8-.8v-9.1c0-.4-.3-.6-.5-.7l-3.2-1.3c-.3-.2-.8-.5-1.1-1l-6.5-10c-.1-.2-.4-.3-.7-.3H2.8c-.4 0-.8.4-.8.8v21.6c0 .4.4.8.8.8h3.9v2H2.8C1.3 35.3 0 34 0 32.5V10.9c0-1.5 1.3-2.8 2.8-2.8h31.3c1 0 1.9.5 2.4 1.3l6.5 10 .4.4 2.9 1.2c1.1.5 1.7 1.4 1.7 2.5v9.1c0 1.4-1.3 2.7-2.8 2.7z" data-original="#000000" />
                    <path d="M26.5 21H3.9v-9.4h22.6zM5.9 19h18.6v-5.4H5.9zm32.9 2H27.9v-9.4h6.3zm-8.9-2h5.7L33 13.6h-3.1zm-19 20.9c-3.1 0-5.6-2.5-5.6-5.6s2.5-5.6 5.6-5.6 5.6 2.5 5.6 5.6-2.5 5.6-5.6 5.6zm0-9.2c-2 0-3.6 1.6-3.6 3.6s1.6 3.6 3.6 3.6 3.6-1.6 3.6-3.6-1.6-3.6-3.6-3.6zm27.9 9.2c-3.1 0-5.6-2.5-5.6-5.6s2.5-5.6 5.6-5.6 5.6 2.5 5.6 5.6-2.5 5.6-5.6 5.6zm0-9.2c-2 0-3.6 1.6-3.6 3.6s1.6 3.6 3.6 3.6 3.6-1.6 3.6-3.6-1.6-3.6-3.6-3.6z" data-original="#000000" />
                </svg>
                Free delivery on orders over $100
            </div>
        </div>
    </div>

    {/* Product Description */}
    <div className="mt-8 max-w-2xl px-6">
        <h3 className="text-lg font-bold text-gray-300">Product Description</h3>
        <p className="text-sm text-gray-200 mt-4">{product.Product_Description}</p>
    </div>
</div>

    )};

export default ProductDetails;
