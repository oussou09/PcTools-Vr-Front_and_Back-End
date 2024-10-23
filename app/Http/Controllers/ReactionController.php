<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class ReactionController extends Controller
{
    use AuthorizesRequests;

    public function StoreReaction(Request $request) {

        // dd($request->all());

        $this->authorize('IsLiking', Product::class);

        $validatedData = $request->validate([
            'userid' => 'required|numeric' ,
            'productid' => 'required|numeric'
        ]);

        $user = $request->user(); // Get the authenticated user
        if ($user->id !== $validatedData['userid']) {
            return response()->json([
                'message' => 'Unauthorized access.',
                'status' => 403,
            ], 403);
        }


        $product = Product::findOrFail($validatedData['productid']);
        if ($user->likedProducts()->where('product_id', $product->id)->exists()) {
            $user->likedProducts()->detach($product->id);
        } else {
            $user->likedProducts()->attach($product->id);
        }

        return response()->json([
            'message' => 'Reaction updated successfully',
            'status' => 200,
        ]);

    }
}
