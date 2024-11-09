<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class HomeController extends Controller
{


    public function storecontact(Request $request) {
        $contactdata = $request->validate([
            'email' => 'email|required|string',
            'message' => 'required|string|min:10',
        ]);

        Contact::create($contactdata);

        // dd($request);
        return response()->json([
            'message' => 'the request was successful',
            'status' => 200,
        ]);
    }
}
