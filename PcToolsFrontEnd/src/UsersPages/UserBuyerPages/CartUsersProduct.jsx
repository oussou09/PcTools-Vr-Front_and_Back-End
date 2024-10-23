// FunctLikeDeslike.js

import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getCsrfToken } from '../../HeplersFunctions/csrfTokenCheck'; // Import your CSRF helper function
import RemoveTwoToneIcon from '@mui/icons-material/RemoveTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import { useContext, useEffect, useState } from 'react';
import { FuncRemoveFromCart } from './FuncRemoveFromCart';
import { ProductsContext } from '../../HeplersFunctions/GetAllProducts';
import { AuthContext } from '../../HeplersFunctions/CheckSCRFandAUTH';
import { SnakAlert, SnakAlertError } from '../../AlertMessage/SnakAlert';

 function CartUsersProduct() {

    const { refreshProducts } = useContext(ProductsContext);
    const { refreshUserData } = useContext(AuthContext);

    const navigate = useNavigate();
    const [carts, setCarts] = useState(null);
    const [totalProduct, setTotalProduct] = useState(null);
    const [totalProductFees, setTotalProductFees] = useState(null);

    const [productLength, setProductLength] = useState(null);
    const [productShipping, setProductShipping] = useState(null);




    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const fetchCartData = async () => {
        const token = Cookies.get('auth_user_token'); // Get user auth token
        try {
            if (!token) throw new Error("Token not found");

            // If not found in context, fetch from backend
            const csrfToken = await getCsrfToken();
            const response = await axios.get(`http://localhost:8000/api/ShowToCart`, {
                headers: {
                    'X-XSRF-TOKEN': csrfToken,
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            });

            if (response.data.status === 200) {
                setCarts(response.data);
            }
        } catch (error) {
            console.error('Error fetching Cart:', error);
            navigate('/404');
        }
    };

    useEffect(() => {
        fetchCartData(); // Fetch cart data when the component mounts
    }, []);

    useEffect(() => {
        if (carts && carts.data) {
            console.log("Updated cart:", carts);

            // Calculate the total price by reducing the cart items
            const newTotal = carts.data.reduce((acc, cartItem) => {
                console.log(cartItem.product.Product_Price);
                return acc + parseInt(cartItem.product.Product_Price);
            }, 0);

            setTotalProduct(newTotal);
            setProductLength(carts.data.length)
            setProductShipping(productLength<5 ? productLength*15 : 0)
            setTotalProductFees(newTotal+productLength+productShipping)
            console.log("Total:", parseInt(newTotal));
            console.log("ProductLength:", productLength);

        }
    }, [carts]); // Only run when carts changes

    const handleRemoveProductCard = async (product_id) => {
        try {
            console.log("product send",product_id)
            const response = await FuncRemoveFromCart(product_id);

            await refreshUserData();
            // await refreshProducts();
            await fetchCartData();
            setAlertMessage(`${response.message}.`);
            setIsError(false);
            setAlertOpen(true);
            console.log('remove product successful:', response);
        } catch (error) {
              console.error('failed remove product:', error);
              setAlertMessage(`Sorry ! ${error}.`);
              setIsError(true);
              setAlertOpen(true);
        }
    };


    return(
        <div className="font-sans max-w-4xl max-md:max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-extrabold text-gray-100">Your Cart</h1>
            <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="md:col-span-2 space-y-4">

                {carts?.data && carts.data.length > 0 ? (
                    carts.data.map((cartItem) => {
                        return (
                    <div key={cartItem.id} className="flex gap-4 bg-white px-4 py-6 rounded-md shadow-[0_2px_12px_-3px_rgba(6,81,237,0.3)]">
                        <div className="flex gap-4">
                            <div className="w-28 h-28 max-sm:w-24 max-sm:h-24 shrink-0">
                                <img src={`http://localhost:8000/storage/${cartItem.product.images[0]?.path}`} alt={cartItem.product.Product_Title} className="w-full h-full object-contain" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">{cartItem.product.Product_Title}</h3>
                                </div>

                                <div className="mt-5 flex items-center gap-2">
                                    <button type="button"
                                        className="flex items-center justify-center outline-none rounded-full">
                                        <RemoveTwoToneIcon style={{ color: 'black', fontSize: '20px' }} />
                                    </button>
                                    <span className="font-bold text-sm text-black leading-[18px]">{cartItem.quantity}</span>
                                    <button type="button"
                                        className="flex items-center justify-center outline-none rounded-full">
                                        <AddTwoToneIcon style={{ color: 'black', fontSize: '20px' }} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="ml-auto flex flex-col">
                            <div className="flex items-start gap-4 justify-end">
                                <button type="button"
                                    onClick={() => { handleRemoveProductCard(cartItem.product.id)}}
                                    className="flex items-center justify-center outline-none rounded-full">
                                    <DeleteOutlineTwoToneIcon style={{ color: 'red', fontSize: '30px' }} />
                                </button>
                            </div>
                            <h3 className="text-base font-bold text-gray-800 mt-auto">{cartItem.product.Product_Price}</h3>
                        </div>
                    </div>
                    )})
                    ) : (
                        <h1 className="text-2xl font-bold text-gray-100">No products in your carts available</h1>
                    )}


                </div>

                <div className="bg-white rounded-md px-4 py-6 h-max shadow-[0_2px_12px_-3px_rgba(6,81,237,0.3)]">
                    <ul className="text-gray-800 space-y-4">
                        <li className="flex flex-wrap gap-4 text-sm">Subtotal <span className="ml-auto font-bold">${totalProduct}.00</span></li>
                        <li className="text-sm bg-gray-800 text-white p-3 rounded-lg shadow-md">
                            <span className="text-yellow-400 font-semibold">Attention!</span>
                            <span className="text-white"> If you buy 5 or more products, shipping will be free!</span>
                        </li>
                        <li className="flex flex-wrap gap-4 text-sm">Shipping <span className="ml-auto font-bold">{productShipping>0 ? `$${productShipping}.00` : "Free Shipping"}</span></li>
                        <li className="flex flex-wrap gap-4 text-sm">Tax <span className="ml-auto font-bold">${productLength}.00</span></li>
                        <hr className="border-gray-300" />
                        <li className="flex flex-wrap gap-4 text-sm font-bold">Total <span className="ml-auto">${totalProductFees}.00</span></li>
                    </ul>

                    <div className="mt-8 space-y-2">
                        <button type="button" className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-gray-800 hover:bg-gray-900 text-white rounded-md">Buy Now</button>
                        <Link to={'/products'} className="block text-center text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-transparent hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-md">Continue Shopping</Link>
                    </div>

                    <div className="mt-4 flex flex-wrap justify-center gap-4">
                        <img src='https://readymadeui.com/images/master.webp' alt="card1" className="w-10 object-contain" />
                        <img src='https://readymadeui.com/images/visa.webp' alt="card2" className="w-10 object-contain" />
                        <img src='https://readymadeui.com/images/american-express.webp' alt="card3" className="w-10 object-contain" />
                    </div>
                </div>
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
    )
}

export default CartUsersProduct;
