<?php

namespace App\Models;

use App\Models\ProductImage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';


    protected $fillable = ['user_id', 'Product_Title', 'Product_Description', 'Product_Price'];


    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }


    // Retrieve individual likes (records in the LikeProducts model)
    public function likes()
    {
        return $this->hasMany(LikeProducts::class);
    }

    // Direct access to users who liked this product
    public function likedByUsers()
    {
        return $this->belongsToMany(User::class, 'like_products');
    }

    public function cartItems() {
        return $this->hasMany(CartItems::class);
    }

}
