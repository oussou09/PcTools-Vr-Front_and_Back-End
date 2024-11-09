// FunctLikeDeslike.js

import axios from 'axios';
import Cookies from 'js-cookie';
import { getCsrfToken } from '../../HeplersFunctions/csrfTokenCheck'; // Import your CSRF helper function
import CategoryIcon from '@mui/icons-material/Category';
import MemoryIcon from '@mui/icons-material/Memory';
import { useEffect, useState } from 'react';
import styled from "styled-components";

 function ProductCategotyList({ selectedCategory, setSelectedCategory }) {

    const [categories, setCategories] = useState(null);
    // const [selectedCategory, setSelectedCategory] = useState(null);


    const fetchCategoryData = async () => {
        const token = Cookies.get('auth_user_token'); // Get user auth token
        try {
            if (!token) throw new Error("Token not found");

            // If not found in context, fetch from backend
            const csrfToken = await getCsrfToken();
            const response = await axios.get(`http://localhost:8000/api/ProductCategory`, {
                headers: {
                    'X-XSRF-TOKEN': csrfToken,
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            });

            if (response.data.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Error fetching Cart:', error);
        }
    };

    const handleSelectedCategory = (value) => {
        setSelectedCategory(value);
    }

    useEffect(() => {
        fetchCategoryData(); // Fetch cart data when the component mounts
    }, []);

    // console.log('selected category is:',selectedCategory)

    return(
        <>
            {categories?.data && categories.data.length > 0 ? (
                <StyledWrapper>
                    <h1 className="text-2xl font-bold text-gray-100 mb-4">Select Category of Product</h1>
                    <div className="radio-inputs">
                    <label>
                        <input
                            className="radio-input"
                            type="radio"
                            name="engine"
                            value="null"
                            checked={selectedCategory === 0}
                            onChange={() => handleSelectedCategory(0)}
                        />
                        <span className="radio-tile">
                            <span className="radio-icon">
                            <CategoryIcon style={{ color: 'black', fontSize: '50px' }} />
                            </span>
                            <span className="radio-label pr-2">Without</span>
                        </span>
                    </label>
                    {categories.data.map((category,index) => (
                        <label key={index}>
                        <input
                            className="radio-input"
                            type="radio"
                            name="engine"
                            value={category.id}
                            checked={selectedCategory === category.id}
                            onChange={() => handleSelectedCategory(category.id)}
                        />
                        <span className="radio-tile" >
                            <span className="radio-icon">
                            <MemoryIcon style={{ color: 'black', fontSize: '50px' }} />
                            </span>
                            <span className="radio-label pr-2">{category.name_category}</span>
                        </span>
                        </label>
                    ))}
                    </div>
                </StyledWrapper>
                ) : (
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">No Category available</h1>
                )}
        </>
    )
}
const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1rem;

  .radio-inputs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px; /* Space between tiles */
    justify-content: center;
    // max-width: 400px;
    max-width: 100vw;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .radio-input:checked + .radio-tile {
    border-color: #2260ff;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    color: #2260ff;
  }

  .radio-input:checked + .radio-tile:before {
    transform: scale(1);
    opacity: 1;
    background-color: #2260ff;
    border-color: #2260ff;
  }

  .radio-input:checked + .radio-tile .radio-icon svg {
    fill: #2260ff;
  }

  .radio-input:checked + .radio-tile .radio-label {
    color: #2260ff;
  }

  .radio-tile {
    display: flex;
    // flex-direction: column;
    align-items: center;
    justify-content: center;
    width: auto;
    min-height: auto;
    // min-height: calc(auto + 50px);
    // min-height: auto;
    // padding-top: 10px; /* or padding as needed */
    // padding-bottom: 10px;
    border-radius: 8px;
    border: 3px solid #b5bfd9;
    background-color: #fff;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    transition: 0.15s ease;
    cursor: pointer;
    position: relative;
  }

  .radio-tile:hover {
    border-color: #2260ff;
  }

  .radio-tile:hover:before {
    transform: scale(1);
    opacity: 1;
  }

  .radio-icon svg {
    width: 2rem;
    height: 2rem;
    fill: #494949;
  }

  .radio-label {
    color: #707070;
    transition: 0.375s ease;
    text-align: center;
    font-size: 14px;
    margin-top: 4px;
  }

  .radio-input {
    clip: rect(0 0 0 0);
    -webkit-clip-path: inset(100%);
    clip-path: inset(100%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
`;


export default ProductCategotyList;
