<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessImageJob;
use App\Models\Product;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;


class ProductsController extends Controller
{

    use AuthorizesRequests;

    public function GetAllProducts()
    {
        // Retrieve all products with their associated images
        $products = Product::with(['images', 'likes'])->withCount('likes')->get();

        // Return the products as a JSON response
        return response()->json([
            'products' => $products,
        ], 200);
    }


///////////////// Users buyer Products //////////////////




    public function edit(string $id)
    {
        //
    }




///////////////// Add Users Seller Products //////////////////

public function addproduct(Request $request)
{
    // Authenticate user using 'sanctum' guard
    $user = Auth::guard('sanctum')->user();

    // Check if the authenticated user is authorized to sell products
    if (Gate::forUser($user)->allows('sell-products')) {
        // The user is authorized to sell products

        // Validate the request
        $ProductData = $request->validate([
            'productName' => 'required|string|max:100|min:10',
            'Description' => 'required|string|min:10|max:500',
            'productPrice' => 'required|numeric|min:1',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'productCategory' => 'required|numeric'
        ]);

        // Create the product
        $product = Product::create([
            'user_id' => $user->id,
            'Product_Title' => $ProductData['productName'],
            'Product_Description' => $ProductData['Description'],
            'Product_Price' => $ProductData['productPrice'],
            'category_id' => $ProductData['productCategory'],
        ]);

        $imageUrls = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                // Store the image
                $path = $image->store('images');

                // Save the image path in the ProductImage model
                $product->images()->create([
                    'path' => $path,
                ]);

                // Get the full URL for the stored image
                $imageUrls[] = Storage::url($path);
            }
        } else {
            Log::error('No images found in the request.');
        }

        // Return the URLs of uploaded images
        return response()->json([
            'message' => 'Files uploaded successfully',
            'urls' => $imageUrls,
        ], 201);

    } else {
        return response()->json(['message' => 'Unauthorized'], 403);
    }
}

///////////////// Delete Users Seller Products //////////////////

public function DeleteProduct(Request $request)
{
    // Retrieve the currently authenticated user
    $user = $request->user();

    // dd($request->all());

    $validated = $request->validate([
        'selectedProductId' => 'required|integer'
    ]);

    $product = Product::findOrFail($validated['selectedProductId']);

    $this->authorize('delete', $product);
    // Fetch products associated with the user


    $product->delete();

    return response()->json([
        'status' => 200,
        'message' => 'product has been deleted'
    ]);

}

///////////////// Show Users Seller Products //////////////////

public function UserProducts(Request $request)
{
    // Retrieve the currently authenticated user
    $user = $request->user();

    $this->authorize('viewAny', Product::class);
    // Fetch products associated with the user
    $products = Product::where('user_id', $user->id)->with('images')->get();

    return response()->json([
        'status' => 200,
        'data' => $products
    ]);

}

public function ProductDetails(Request $request)
{
    // Fetch products associated with the user
    $productsFound = Product::where('id', $request->query('id'))->get('id');

    if ($productsFound->isEmpty()) {
        return response()->json([
            'status' => 404,
            'data' => 'product not found'
        ]);
    }

    return response()->json([
        'status' => 200,
        'data' => $productsFound
    ]);

}


    public function update(Request $request, string $id)
    {
        //
    }

}
