<?php

return [

    'defaults' => [
        'guard' => 'web',  // Default guard, can be 'web' or 'userapi'
        'passwords' => 'users',
    ],

    'guards' => [
        // Session-based authentication for users
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],

        // Session-based authentication for admins
        'admin' => [
            'driver' => 'session',
            'provider' => 'admins',
        ],

        // API-based authentication using Sanctum for users
        'userapi' => [
            'driver' => 'sanctum',
            'provider' => 'users',
        ],

        // API-based authentication using Sanctum for admins
        'adminapi' => [
            'driver' => 'sanctum',
            'provider' => 'admins',
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],

        'admins' => [
            'driver' => 'eloquent',
            'model' => App\Models\Admin::class,
        ],
    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => 'password_resets',
            'expire' => 60,
            'throttle' => 60,
        ],

        'admins' => [
            'provider' => 'admins',
            'table' => 'password_resets',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => 10800,

];
