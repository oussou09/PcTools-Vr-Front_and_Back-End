import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { ProductsContext } from '../../HeplersFunctions/GetAllProducts';
import { SnakAlert, SnakAlertError } from '../../AlertMessage/SnakAlert';
import { useNavigate } from 'react-router-dom';
import ProductCategotyList from '../UserBuyerPages/ProductCategotyList';

const ProductForm = () => {
  const { register, handleSubmit, setValue, formState: { errors }, clearErrors, reset } = useForm();
  const [previewUrls, setPreviewUrls] = useState([]);
  const [selectedCategoryData, setSelectedCategoryData] = useState('null');
  const { refreshProducts } = useContext(ProductsContext);
  const navigate = useNavigate();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
        setValue('images', files); // Store images as an array in form data
        clearErrors('images');

        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(previews);
    }
};


  // Handle form submission (Upload files to the server)
  const onSubmit = async (data) => {
    const csrfToken = Cookies.get('XSRF-TOKEN');
    const token = Cookies.get('auth_user_token');
    const formData = new FormData();

    // Append files directly from the file input to FormData
    const imageFiles = document.getElementById('images').files;
    for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images[]', imageFiles[i]);
    }

    // Append other form fields
    formData.append('productName', data.productName);
    formData.append('Description', data.Description);
    formData.append('productPrice', data.productPrice);
    formData.append('productCategory', selectedCategoryData);

    // Log FormData content to confirm it has images
    for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
        const response = await axios.post('http://localhost:8000/api/add-product', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-XSRF-TOKEN': csrfToken,
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log(response);
        reset();
        await refreshProducts();
        navigate('/products');
        setAlertMessage('Product has been created.');
        setIsError(false);
        setAlertOpen(true);
    } catch (error) {
        console.error('Error uploading images:', error);
        setAlertMessage('Failed to create product.');
        setIsError(true);
        setAlertOpen(true);
    }
};





  return (
    <div className='bg-gray-900 py-10'>
      <div className="mx-auto bg-gray-200 px-10 py-6 rounded-md shadow-md w-[65vw] xl:w-[50vw] h-full">
        <form method='POST' onSubmit={handleSubmit(onSubmit)}>
          {/* Product Name Field */}
          <div className="mb-4">
            <label htmlFor="productName" className="block text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              id="productName"
              placeholder="Product Title"
              className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('productName', {
                required: 'Product Name is required',
                minLength: { value: 10, message: 'Product Name must be at least 10 characters long' },
                maxLength: { value: 100, message: 'Product Name must be at most 100 characters long' },
              })}
            />
            {errors.productName && (
              <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>
            )}
          </div>

          {/* Product Image Field */}
          <div className="mb-4">
            <label htmlFor="images" className="block text-gray-700 mb-2">Product Image</label>
            <div className="relative w-full group">
              <label htmlFor="images"
                className="bg-white w-full text-gray-500 font-semibold text-base rounded h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-11 mb-2 fill-gray-500" viewBox="0 0 32 32">
                  <path
                    d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                    data-original="#000000" />
                  <path
                    d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                    data-original="#000000" />
                </svg>
                Upload files
                <input
                  type="file"
                  id='images'
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                  {...register('images', {
                    required: 'Please upload at least one image',
                    validate: files => files instanceof FileList && files.length > 0 || 'At least one file is required'
                  })}
                />
                <p className="text-xs font-medium text-gray-400 mt-2">PNG, JPG, SVG, WEBP are Allowed.</p>
              </label>
            </div>

            {errors.images && (
              <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="mb-4">
            <label htmlFor="Description" className="block text-gray-700 mb-2">Description</label>
            <textarea
              id="Description"
              placeholder='Type Message'
              className="p-4 bg-white text-gray-700 w-full mx-auto block text-sm border border-gray-300 outline-[#007bff] rounded"
              rows="4"
              {...register('Description', {
                required: 'Description is required',
                minLength: { value: 10, message: 'Description must be at least 10 characters long' },
                maxLength: { value: 500, message: 'Description must be at most 500 characters long' },
              })}
            />
            {errors.Description && (
              <p className="text-red-500 text-sm mt-1">{errors.Description.message}</p>
            )}
          </div>

          {/* Category Field */}
          <div className="mb-4 relative">
            <ProductCategotyList
              selectedCategory={selectedCategoryData}
              setSelectedCategory={setSelectedCategoryData}
            />
          </div>

          {/* Price Field */}
          <div className="mb-4">
            <label htmlFor="productPrice" className="block text-gray-700 mb-2">Price</label>
            <input
              type="number"
              id="productPrice"
              placeholder="Price"
              className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('productPrice', {
                required: 'Price is required',
                min: { value: 1, message: 'Price must be at least 1' },
              })}
            />
            {errors.productPrice && (
              <p className="text-red-500 text-sm mt-1">{errors.productPrice.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button type="submit" className="px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Add Product</button>
          </div>
        </form>

        {/* Uploaded Image Previews */}
        {previewUrls.length > 0 && (
          <div className="mt-6">
            <h3 className="text-gray-700 mb-2">Image Previews:</h3>
            <div className="flex flex-wrap justify-evenly items-center p-5 md:p-0">
              {previewUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt="preview"
                  className="h-32 w-32 object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Alert Messages */}
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

export default ProductForm;
