import React from 'react';
import Cookies from 'js-cookie';
import { getCsrfToken } from '../../HeplersFunctions/csrfTokenCheck';
import axios from 'axios';



export  const FuncRemoveFromCart = async(product_id) => {
    console.log("product get",product_id)

    const token = Cookies.get('auth_user_token');

    if (!token) {
        console.error("User is not authenticated.");
        throw new Error("User is not authenticated.");
    }

    try {
        const csrfToken = await getCsrfToken();

        const response = await axios.delete('http://localhost:8000/api/DeleteFromCart',{
            data: { productid: product_id },
            withCredentials: true,
            headers: {
                'X-XSRF-TOKEN': csrfToken,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return response?.data ;

      } catch (error) {
        console.error('Error during request:', error);
      }
}
