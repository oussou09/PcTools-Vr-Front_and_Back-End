<?php

namespace App\Http\Controllers;

use App\Models\CartItems;
use App\Models\Carts;
use App\Models\Product;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;


class CartController extends Controller
{
    use AuthorizesRequests;



    public function ShowProductCart(Request $request)
    {
        // Get the user and their cart
        $user = $request->user();
        $cart = $user->cart;


        if (!$cart) {
            $cart = Carts::create(['user_id' => $user->id]);
        }

        $this->authorize('view', $cart);

        $exportData = $cart->cartItems()->with('product.images')->get();

        return response()->json([
            'status' => 200,
            'message' => 'Product added to cart successfully',
            'data' => $exportData
        ]);
    }


    public function AddProductCart(Request $request)
    {
        // Validate and retrieve the necessary data from the request
        $product_id = $request->input('productid');
        $quantity = $request->input('quantity', 1); // Default to 1 if quantity is not provided

        // Get the user and their cart
        $user = $request->user();
        $cart = $user->cart;

        // Check if the product exists
        $product = Product::findOrFail($product_id);

        // Authorize action
        // $this->authorize('AddTCart', $cart);

        // If the user doesn't have a cart, create one
        if (!$cart) {
            $cart = Carts::create(['user_id' => $user->id]);
        }

        // dd($cart->id, $product->id);

        // Check if the product is already in the cart
        $cartItem = CartItems::where('cart_id', $cart->id)
                             ->where('product_id', $product->id)
                             ->first();

        if ($cartItem) {
            return response()->json([
                'status' => 409,  // Conflict
                'message' => 'Product already in the cart',
            ]);
        }

        // Add product to cart
        CartItems::create([
            'cart_id' => $cart->id,   // Ensure cart_id is set
            'product_id' => $product->id,
            'quantity' => $quantity,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Product added to cart successfully',
        ]);
    }




    public function DestroyProductCart(Request $request)
    {
        $product_id = $request->input('productid');
        $user = $request->user();
        $cart = $user->cart;

        // Check if the product exists
        $product = Product::findOrFail($product_id);


        if (!$cart) {
            $cart = Carts::create(['user_id' => $user->id]);
        }

        $this->authorize('delete', $cart);

        // Check if the product is already in the cart
        $cartItem = CartItems::where('cart_id', $cart->id)
                             ->where('product_id', $product->id)
                             ->first();

        if ($cartItem) {

            $cartItem->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Product removed from your cart Seccess',
            ]);
        }

        return response()->json([
            'status' => 404,
            'message' => 'Product not found into your cart',
        ]);

    }

}
