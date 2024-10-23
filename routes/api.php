<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\ReactionController;
use App\Http\Controllers\UsersController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;





Route::get('/csrf-token', function () {
    return response()->json(['csrfToken' => csrf_token()]);
});


Route::fallback(function () {
    return response()->json([
        'message' => 'API route not found.',
    ], 404);
});

/////////////////////// home controller /////////////////////////

Route::post('/contact',[HomeController::class,'storecontact']);


//////////////////////////// Auth Form Users ///////////////////////////

Route::post('/login',[UsersController::class,'loginusereque']);
Route::post('/register',[UsersController::class,'registeruser']);


Route::middleware('auth:sanctum')->group(function () {

////////////////// Auth Users Info //////////////////
Route::get('/UserInfo', [UsersController::class, 'UserData']);
Route::post('/UserLogout', [UsersController::class, 'UserLogout']);
Route::post('/UserDelete', [UsersController::class, 'UserDelete']);
///////////////// all products users  /////////////////

});

Route::get('/products', [ProductsController::class, 'GetAllProducts']);
Route::get('/product-Details', [ProductsController::class, 'ProductDetails']);





//////////////////////////// users seller /////////////////////////////////

Route::middleware(['auth:sanctum', 'can:sell-products'])->group(function () {
    Route::post('/add-product', [ProductsController::class, 'addproduct']);
    Route::get('/UserProducts', [ProductsController::class, 'UserProducts']);
});

//////////////////////////// users buyer /////////////////////////////////

Route::middleware('auth:sanctum')->group(function () {
        Route::post('/reactions', [ReactionController::class, 'StoreReaction']);
        Route::post('/AddToCart', [CartController::class, 'AddProductCart']);
        Route::get('/ShowToCart', [CartController::class, 'ShowProductCart']);
        Route::delete('/DeleteFromCart', [CartController::class, 'DestroyProductCart']);

});








// Route::group([],function () {
    // Route::middleware(['AuthUser'])->group(function() {
    //     Route::get('/',[UsersContoll::class,'dashborduser'])->name('dashborduser');
    //     Route::get('/profile/{id}',[UsersContoll::class,'profileuser'])->name('profileuser');
    //     // Edit User
    //     Route::get('/edit/{id}',[UsersContoll::class,'edituser'])->name('edituser');
    //     Route::put('/edit/{id}',[UsersContoll::class,'updateuser'])->name('updateuser');
    //     Route::get('/edit/{id}/password',[UsersContoll::class,'updatepassuser'])->name('updatepassuser');
    //     Route::put('/edit/{id}/password-changing',[UsersContoll::class,'updatepassusereq'])->name('updatepassusereq');
    //     // Logout
    //     Route::post('/logout',[UsersController::class,'logoutuser']);
    // });

// });


// //////////////////////// Product

// Route::middleware(['AuthUser'])->group(function () {
//     Route::resource('product', ProductControll::class);
//     Route::get('product/{slug}', [ProductControll::class, 'show'])->name('product.show');
//     Route::get('product/my-product/{id}', [ProductControll::class, 'myproduct'])->name('product.myproduct');
//     Route::put('product/{id}', [ProductControll::class, 'update'])->name('product.update');
//     Route::post('product/{id}/like-and-dislike', [ReactionController::class, 'StoreReaction'])->name('product.StoreReaction');
//     Route::get('product/product-i-like/{id}', [ReactionController::class, 'ShowAllProductLiked'])->name('product.ShowAllProductLiked');
// });


// //////////////////////// admins

// Route::name('admin.')->prefix('wp-admin')->group(function() {
//     Route::get('/login',[AdminControll::class,'loginAdmin'])->name('loginAdmin');
//     Route::post('/login',[AdminControll::class,'loginAdminRequ'])->name('loginAdminRequ');
//     Route::middleware('AuthAdmin')->group(function() {
//         Route::get('/',[AdminControll::class,'homeadmin'])->name('homeadmin');
//         Route::get('/show-users',[AdminControll::class,'listusers'])->name('listusers');
//         Route::get('/messages-center',[AdminControll::class,'listcontact'])->name('listcontact');
//         Route::post('/logout',[AdminControll::class,'logoutAdmin'])->name('logoutAdmin');
//         route::get('/show-message/{id}', [AdminControll::class, 'showmessage'])->name('showmessage');
//         route::post('/delete/{id}',[AdminControll::class,'destroymessage'])->name('destroymessage');
//     });
// });

