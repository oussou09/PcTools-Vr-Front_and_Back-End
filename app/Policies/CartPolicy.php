<?php

namespace App\Policies;

use App\Models\Carts;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Log;

class CartPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Carts $cart): bool
    {
        // dd('test'); // This should now work
        return $user->account_type === "0" && $user->id === $cart->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Carts $carts): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Carts $cart): bool
    {
        return $user->account_type === "0" && $user->id === $cart->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Carts $carts): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Carts $carts): bool
    {
        //
    }
}
