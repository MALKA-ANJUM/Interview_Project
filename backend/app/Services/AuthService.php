<?php

namespace App\Services;

use App\Repositories\Interfaces\AuthRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthService
{
    protected $authRepository;

    public function __construct(AuthRepositoryInterface $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    public function register(array $data)
    {
        try {
            $data['password'] = Hash::make($data['password']);

            $user = $this->authRepository->create($data);

            $user->assignRole('user');

            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('User registered successfully', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);

            return [
                'token' => $token,
                'user'  => $user,
                'role'  => 'user'
            ];

        } catch (\Throwable $e) {

            Log::error('User registration failed', [
                'data' => $data,
                'error' => $e->getMessage()
            ]);

            throw new \Exception("Registration failed");
        }
    }

    public function login(array $data)
    {
        try {
            $user = $this->authRepository->findByEmail($data['email']);

            if (! $user || ! Hash::check($data['password'], $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['Invalid credentials.'],
                ]);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('User logged in', [
                'user_id' => $user->id,
                'role' => $user->getRoleNames()->first()
            ]);

            return [
                'token' => $token,
                'user'  => $user,
                'role'  => $user->getRoleNames()->first()
            ];

        } catch (\Throwable $e) {

            Log::error('Login failed', [
                'email' => $data['email'] ?? null,
                'error' => $e->getMessage()
            ]);

            throw $e instanceof ValidationException
                ? $e
                : new \Exception("Login failed");
        }
    }

    public function logout($user)
    {
        try {
            $user->tokens()->delete();

            Log::info('User logged out', [
                'user_id' => $user->id
            ]);

        } catch (\Throwable $e) {

            Log::error('Logout failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);

            throw new \Exception("Logout failed");
        }
    }
}
