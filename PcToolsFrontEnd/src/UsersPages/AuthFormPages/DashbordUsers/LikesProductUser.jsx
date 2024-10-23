import React, { useState } from "react";

const ProductList = ({ products, user, handleAddToCart, handleReaction, handleDelete }) => {
  return (
    <div className="flex flex-wrap justify-center items-center">
      {products.map((product) => (
        <div key={product.id} className="relative w-80 bg-gray-900 rounded-2xl m-6 overflow-hidden flex flex-col items-center">
          {/* Image Box */}
          <div className="w-full flex justify-center items-center p-5">
            <img src={product.imageUrl} alt={product.gameName} className="h-64 w-64 object-cover" />
          </div>

          {/* Content Box */}
          <div className="flex flex-col items-center p-5 text-white">
            <h3 className="text-xl font-semibold">
              {product.gameName.length > 50 ? `${product.gameName.substring(0, 50)}...` : product.gameName}
            </h3>
            <h2 className="text-2xl font-bold mt-2">{product.price}<small> €</small></h2>

            <button
              onClick={() => handleAddToCart(product.id)}
              className="mt-4 py-2 px-8 bg-yellow-400 text-black rounded-full uppercase transition-transform duration-500 transform hover:scale-105"
            >
              Add to Cart
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center p-5">
            <a href={`/product/${product.slug}`} className="px-6 py-2 bg-yellow-400 text-black rounded-full mx-2 uppercase">
              Show
            </a>

            {user?.isSeller && user.id === product.user_id && (
              <>
                <a href={`/product/edit/${product.id}`} className="px-6 py-2 bg-yellow-400 text-black rounded-full mx-2 uppercase">
                  Edit
                </a>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-6 py-2 bg-red-600 text-white rounded-full mx-2 uppercase"
                >
                  Delete
                </button>
              </>
            )}
          </div>

          {/* Like Action */}
          <div className="flex justify-center items-center p-2">
            {user && !user.isSeller && user.id !== product.user_id && (
              <form onSubmit={() => handleReaction(product.id)} className="flex items-center">
                <button type="submit" className="bg-transparent border-none">
                  {user.likes.includes(product.id) ? (
                    <img className="w-8 h-8" src="/images/like-svgrepo-com.svg" alt="Dislike" />
                  ) : (
                    <img className="w-8 h-8" src="/images/heart-like-favorite-svgrepo-com.svg" alt="Like" />
                  )}
                </button>
                {product.likedByCount > 0 && (
                  <span className="ml-2 text-red-600 text-lg font-bold">{product.likedByCount}</span>
                )}
              </form>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
