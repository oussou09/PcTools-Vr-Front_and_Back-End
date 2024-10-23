import React from 'react';
import Cookies from 'js-cookie';
import { getCsrfToken } from '../../HeplersFunctions/csrfTokenCheck';
import axios from 'axios';



export  const FuncAddCart = async(navigate ,product_id , quantity=1) => {
    console.log("product get",product_id)

    const token = Cookies.get('auth_user_token');

    if (!token) {
        console.error("User is not authenticated.");
        return navigate('/login');
    }

    try {
        const csrfToken = await getCsrfToken(); // Await the CSRF token

        const DataCartProduct = {
            productid : product_id,
            quantity : quantity ?? 1
        }
        // console.log(DataCartProduct)
        const response = await axios.post('http://localhost:8000/api/AddToCart',
            DataCartProduct,
            {
            withCredentials: true,
            headers: {
                'X-XSRF-TOKEN': csrfToken,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data ;
        // await fetchCartData();


      } catch (error) {
        console.error('Error during request:', error);
      }
}
