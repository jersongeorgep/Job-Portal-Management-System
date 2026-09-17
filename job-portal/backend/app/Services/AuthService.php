<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function register(array $data): array
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'user',
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'user' => $user,
            'access_token' => $token,
        ];
    }

    public function login(array $data): array
    {
        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'user' => $user,
            'access_token' => $token,
        ];
    }

    public function logout(User $user): bool
    {
        return $user->currentAccessToken()?->delete() ?? true;
    }

    /**
     * Sanctum uses single bearer tokens without a separate refresh-token
     * mechanism. Refreshing therefore revokes the current token and issues a
     * fresh one for the authenticated user.
     */
    public function refresh(User $user): array
    {
        if ($user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        return [
            'user' => $user,
            'access_token' => $user->createToken('auth-token')->plainTextToken,
        ];
    }

    public function me(User $user): User
    {
        return $user;
    }
}