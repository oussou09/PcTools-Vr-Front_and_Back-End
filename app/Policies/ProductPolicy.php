<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->account_type == '1'; // Only allow sellers to view any products
    }

    public function IsLiking(User $user): bool
    {
        return $user->account_type == '0'; // Only allow sellers to view any products
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Product $product): bool
    {
        return $user->id === $product->user_id; // Only allow viewing if the user owns the product
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->account_type == '1'; // Only sellers can create products
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Product $product): bool
    {
        return $user->id === $product->user_id; // Only allow updating if the user owns the product
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Product $product): bool
    {
        return $user->id === $product->user_id; // Only allow deleting if the user owns the product
    }

    // Additional methods for restore and force delete can be implemented similarly.
}
