import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductsContext } from '../HeplersFunctions/GetAllProducts';
import LoadingPage from '../HeplersFunctions/LoadingPage';
import { AuthContext } from '../HeplersFunctions/CheckSCRFandAUTH';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Link } from 'react-router-dom';
import { FunctLikeDeslike } from '../UsersPages/UserBuyerPages/FunctLikeDeslike';
import { FuncAddCart } from './UserBuyerPages/FuncAddCart';
import { SnakAlert, SnakAlertError } from '../AlertMessage/SnakAlert';
import { FunDeleteProduct } from './UsersSellersPages/FunDeleteProduct';
import ProductCategotyList from './UserBuyerPages/ProductCategotyList';


const ProductCard = () => {
    const { product: allProducts, refreshProducts } = useContext(ProductsContext);
    const { user, authenticated, likedProductIds, refreshUserData } = useContext(AuthContext);
    const [visibleProducts, setVisibleProducts] = useState(8);
    const navigate = useNavigate();

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    // Function to open the modal
    const openModal = (productId) => {
      setSelectedProductId(productId);
      setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
      setSelectedProductId(null);
      setIsModalOpen(false);
    };


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

  // Function to handle deletion
  const handleDelete = async () => {
    try {
      if (!selectedProductId) return;
      const response = await FunDeleteProduct(selectedProductId);
      if (response.error) {
        console.error(response.error);
      } else {
        console.log('Delete product successful:', response);
        await refreshProducts();
      }
    } catch (error) {
      console.error('Error during delete action:', error);
    } finally {
      closeModal(); // Close the modal after deletion attempt
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
        <div className="p-4 mx-auto mt-3 lg:max-w-7xl sm:max-w-full">

            {/* Category Field */}
            <div className="mb-4 relative">
                <ProductCategotyList
                // selectedCategory={selectedCategoryData}
                // setSelectedCategory={setSelectedCategoryData}
                />
            </div>

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
                                    <div className="flex animate-fade-up opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out space-x-3">
                                        <button type="submit">
                                            <EditOutlinedIcon style={{ color: 'black', fontSize: '30px' }} />
                                        </button>
                                        {/* <form method="POST" onSubmit={() => {handleDelete(product.id)}}> */}
                                        <button type="submit" onClick={() => openModal(product.id)}>
                                            <DeleteOutlineOutlinedIcon style={{ color: 'black', fontSize: '30px' }} />
                                        </button>
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
                                {product.images && product.images[0] ? (
                                    <img
                                        src={`http://localhost:8000/storage/${product.images[0].path}`}
                                        alt="Product"
                                        className="h-full w-full object-contain"
                                        onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                        }}
                                    />
                                    ) : (
                                    <BrokenImageIcon style={{ color: 'black', fontSize: '200px' }} />
                                    )}
                                    {/* // {`http://localhost:8000/storage/${product.images[0].path}`} */}
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
            <div className='flex justify-center items-center'>
            {visibleProducts < allProducts?.products?.length && (
                <button onClick={loadMoreProducts} className="load-more min-w-[200px] my-12 px-4 py-3 bg-gray-100 text-black text-sm font-semibold rounded ">
                    Load More
                </button>
            )}
            </div>

        {/* Modal of delete account */}
        {isModalOpen && (
        <div className="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto flex items-center justify-center">
          <div className="relative mx-auto shadow-xl rounded-md bg-white max-w-md">
            {/* Close button */}
            <div className="flex justify-end p-2">
              <button
                onClick={closeModal}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6 pt-0 text-center">
              <svg
                className="w-20 h-20 text-red-600 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">Are you sure you want to delete this product?</h3>

              {/* Confirm button */}
              <button
                onClick={handleDelete}
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2"
              >
                Yes, Im sure
              </button>

              {/* Cancel button */}
              <button
                onClick={closeModal}
                className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
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
