<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => ['user' => ['id', 'name', 'email', 'role'], 'access_token'],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'newuser@example.com',
            'role' => 'user',
        ]);

        $this->assertNotEquals('password', User::where('email', 'newuser@example.com')->first()->password);
    }

    public function test_registration_requires_valid_data(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => '',
            'email' => 'not-an-email',
            'password' => '123',
        ]);

        $response->assertStatus(422);

        $response = $this->postJson('/api/register', [
            'name' => 'Dup',
            'email' => 'dup@example.com',
            'password' => 'password',
        ]);
        $response->assertStatus(422);
    }

    public function test_user_can_login(): void
    {
        $user = User::factory()->create(['password' => 'password']);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.email', $user->email)
            ->assertJsonStructure(['data' => ['access_token']]);
    }

    public function test_login_with_invalid_credentials_returns_422(): void
    {
        User::factory()->create(['email' => 'known@example.com']);

        $response = $this->postJson('/api/login', [
            'email' => 'known@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422);
    }

    public function test_me_returns_authenticated_user(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('data.user.id', $user->id)
            ->assertJsonPath('data.user.email', $user->email);
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/me')->assertStatus(401);
    }

    public function test_logout_revokes_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth-token')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/logout')
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->app['auth']->forgetGuards();

        $this->withToken($token)->getJson('/api/me')->assertStatus(401);
    }

    public function test_refresh_issues_new_token_and_invalidates_old(): void
    {
        $user = User::factory()->create();
        $oldToken = $user->createToken('auth-token')->plainTextToken;

        $response = $this->withToken($oldToken)->postJson('/api/refresh');

        $response->assertOk()->assertJsonStructure(['data' => ['access_token']]);
        $newToken = $response->json('data.access_token');
        $this->assertNotEquals($oldToken, $newToken);

        $this->app['auth']->forgetGuards();

        $this->withToken($oldToken)->getJson('/api/me')->assertStatus(401);
        $this->withToken($newToken)->getJson('/api/me')->assertOk();
    }
}