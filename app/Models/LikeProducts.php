<?php

namespace App\Models;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LikeProducts extends Model
{
    use HasFactory;

    protected $table = 'like_products';

    protected $fillable = ['user_id', 'product_id'];


    // relation user likes

    public function UsersLikes() {
        return $this->belongsTo(User::class, 'user_id');
    }

    // relation products likes
    public function ProductsLikes() {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
