<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);

         return response()->json(
            $this->authService->register($validated)
        );
    }

    public function login(Request $request)
    {
        return response()->json(
            $this->authService->login($request->only('email','password'))
        );
    }

    public function logout(Request $request)
    {
       $this->authService->logout($request->user());

        return response()->json(['message' => 'Logged out successfully']);
    }
}
