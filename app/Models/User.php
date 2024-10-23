<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\LikeProducts;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

    // protected $guard = 'user';
    protected $table = 'users';

    protected $fillable = [
        'fullname',
        'email',
        'account_type',
        'password',
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }


    // Retrieve individual likes (records in the LikeProducts model)
    public function likes()
    {
        return $this->hasMany(LikeProducts::class);
    }

    // Direct access to products liked by the user
    public function likedProducts()
    {
        return $this->belongsToMany(Product::class, 'like_products');
    }

    public function cart() {
        return $this->hasOne(Carts::class);
    }






    protected $hidden = [
        'password',
        'remember_token',
    ];
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
