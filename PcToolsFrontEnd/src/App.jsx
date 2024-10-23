import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './HomePages/NavBar';
import SectionPage from './HomePages/SectionPage';
import AboutPage from './HomePages/AboutPage';
import ContactPage from './HomePages/ContactPage';
import Login from './UsersPages/AuthFormPages/LoginForm';
import Register from './UsersPages/AuthFormPages/RegisterForm';
import InfoUsers from './UsersPages/AuthFormPages/DashbordUsers/ShowInfoUsers';
import { AuthProvider } from './HeplersFunctions/CheckSCRFandAUTH';
import NavBarUsers from './UsersPages/AuthFormPages/DashbordUsers/NavBarUsers';
import Sidebar from './UsersPages/AuthFormPages/DashbordUsers/SideBar';
import AddProducts from './UsersPages/UsersSellersPages/AddProducts';
import ListProducts from './UsersPages/ListProductsUsers';
import ProductDetails from './UsersPages/DetailsProductsUsers';
import SellerUserProducts from './UsersPages/UsersSellersPages/SellerUserProducts';

import { ProductsProvider } from './HeplersFunctions/GetAllProducts';
import NotFoundPage404 from './errors/NotFoundPage404';
import CartUsersProduct from './UsersPages/UserBuyerPages/CartUsersProduct';



function App() {


  return (
<AuthProvider>
    <ProductsProvider>
        <Router>

        <div className="bg-gray-900 text-white min-h-screen">
            <Routes>
            {/* Home page */}
            <Route path="/" element={
                <>
                <Navbar />
                <SectionPage />
                </>
                } />

            {/* About page */}
            <Route path="/about" element={
                <>
                <Navbar />
                <AboutPage />
                </>
                } />

            {/* Contact page */}
            <Route path="/contact" element={
                <>
                <Navbar />
                <ContactPage />
                </>
                } />

                {/* Dashbord Users Page */}

                <Route path="/profile/:id" element={
                <>
                <NavBarUsers />
                {/* <div className="flex flex-row"> */}
                    {/* <Sidebar /> */}
                    <InfoUsers />
                {/* </div> */}
                </>
                } />


                {/* Get All Products */}

                <Route path="/products" element={
                <>
                    <NavBarUsers />
                    <ListProducts />
                </>
                } />

                <Route path="/products/:Product_Title/:id" element={
                <>
                    <NavBarUsers />
                    <ProductDetails />
                </>
                } />


                {/* Sellers Users Page */}

                <Route path="/products/create" element={
                    <>
                    <NavBarUsers />
                    <AddProducts />
                </>
                } />

                <Route path="/products/seller/:id" element={
                    <>
                    <NavBarUsers />
                    <SellerUserProducts />
                </>
                } />

                <Route path="/cart/user/:id" element={
                    <>
                    <NavBarUsers />
                    <CartUsersProduct />
                </>
                } />






                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />



                {/* Define the dedicated 404 route */}
                <Route path="/404" element={<NotFoundPage404 />} />
                {/* Redirect any undefined route to the 404 page */}
                <Route path="*" element={<Navigate to="/404" replace />} />

            </Routes>
        </div>

        </Router>
    </ProductsProvider>
</AuthProvider>
  );
}

export default App;
