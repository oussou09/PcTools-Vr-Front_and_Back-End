<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    protected function redirectTo($request)
    {
        // For API requests, return a JSON error instead of redirecting to the login page
        if (!$request->expectsJson()) {
            return response()->json([
                'message' => 'Unauthorized Login',
                'status' => 401,
            ]);
        }

        return null;  // Do not redirect if this is an API request
    }
}
