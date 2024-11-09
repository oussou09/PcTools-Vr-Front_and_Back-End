<?php

namespace App\Http\Controllers;
use App\Models\Carts;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class UsersController extends Controller
{

    public function registeruser(Request $request)
    {
        $credentials = $request->validate([
            'fullname' => 'required|string|min:10|max:50',
            'email' => 'required|string|email|max:255|unique:users',
            'account_type' => 'required|in:0,1', // Buyer (0) or Seller (1)
            'password' => 'required|string|min:10|max:30',
        ]);

        // Hash the password
        $credentials['password'] = bcrypt($credentials['password']);

        try {
            $user = User::create($credentials);

            if ($user["account_type"] == 0) {
                Carts::create(['user_id' => $user->id]);
            }

            return response()->json([
                'message' => 'User created successfully',
                'status' => 200,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function loginusereque(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Retrieve the user by email
        $user = User::where('email', $credentials['email'])->first();

        // Use Hash::check to verify the password
        if ($user && Hash::check($credentials['password'], $user->password)) {
            // Define token abilities based on the user's account type
            $abilities = $user->account_type === '0' ? ['buyer'] : ['seller'];

            // Create and return an API token
            $token = $user->createToken('user-token', $abilities)->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'status' => 200,
                'token' => $token,
            ]);
        }

        return response()->json([
            'message' => 'Invalid credentials',
            'status' => 401,
        ]);
    }


    public function UserLogout(Request $request)
    {
        if ($request->user()) {
            // Revoke the API token if using `userapi`
            if ($request->hasHeader('Authorization')) {
                $request->user()->currentAccessToken()->delete();
            }

            // If the user is logged in via session, logout and invalidate session
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json([
                'message' => 'Logout successful',
                'status' => 200,
            ]);
        }

        return response()->json([
            'message' => 'Not authenticated',
            'status' => 401,
        ]);
    }


            // if (Auth::check()) {
            //     Log::info('User authenticated', ['user' => Auth::user()]);
            // } else {
            //     Log::error('User not authenticated');
            // }
    // public function UserData(Request $request)
    // {
    //     // dd( Auth::guard('web')->user());
    //     // dd( Auth::user());

    //     return response()->json([
    //         'status' => 200,
    //         'user' => $request->user(), // Returns the authenticated user
    //     ]);
    // }


    public function UserData(Request $request)
    {
        $user = $request->user(); // This is the same as Auth::user() with Sanctum

        if ($user) {
            // Create the export data array

            $cart = $user->cart;

            if (!$cart) {
                $cart = Carts::create(['user_id' => $user->id]);
            }

            $exportData = [
                'id' => $user->id,
                'fullname' => $user->fullname,
                'email' => $user->email,
                'account_type' => $user->account_type,
                // 'roles' => $user->roles->pluck('name'),  // Return role names
                // 'products' => $user->products->pluck('name'),  // List of product names
                // 'cart_products' => optional($user->cart)->products->pluck('name'), // List of cart product names (if exists)
            ];
            // Conditionally add fields based on `account_type`
            if ($user->account_type === 1) {
                $exportData['products_count'] = $user->products ? $user->products->count() : 0;
            } else {
                $exportData['likedProducts'] = $user->likedProducts;
                $exportData['UserCart'] = $user->cart->cartItems->count();
            }

            return response()->json([
                'status' => 200,
                'message' => 'User data exported successfully',
                'data' => $exportData
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Unauthenticated',
            ], 401);
        }
    }

    public function ResetPassword(Request $request)
    {
        $user = $request->user();

        if ($user) {

            // Validate the incoming request data
            $credentials = $request->validate([
                'CurrentPassword' => 'required',
                'NewPassword1' => 'required|min:8',
                'NewPassword2' => 'required|same:NewPassword1', // Ensures the passwords match
            ]);

            // Verify that the provided current password matches the user's current password
            if (!Hash::check($credentials['CurrentPassword'], $user->password)) {
                return response()->json([
                    'message' => 'Current password is incorrect',
                    'status' => 400,
                ], 400);
            }

            // Update the user's password with the new password
            $user->password = Hash::make($credentials['NewPassword1']);
            $user->save();

            return response()->json([
                'message' => 'Password has been updated successfully',
                'status' => 200,
            ], 200);
        }

        return response()->json([
            'message' => 'Not authenticated',
            'status' => 401,
        ]);
    }

    public function UserDelete(Request $request)
    {
        $user = $request->user();

        if ($user) {
            // Revoke the API token if using `userapi`
            if ($request->hasHeader('Authorization')) {
                $user->currentAccessToken()->delete();
            }

            // If the user is logged in via session, logout and invalidate session
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            // Delete the user record from the database
            $user->delete();

            return response()->json([
                'message' => 'Delete successful',
                'status' => 200,
            ]);
        }

        return response()->json([
            'message' => 'Not authenticated',
            'status' => 401,
        ]);
    }




}
