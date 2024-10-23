<?php

namespace App\Providers;

use App\Models\Carts;
use App\Models\User;
use App\Policies\CartPolicy;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

        Gate::define('sell-products', function (User $user) {
            return $user->account_type == '1'; // Only sellers can sell products
        });

        Gate::policy(Carts::class, CartPolicy::class);
    }
}