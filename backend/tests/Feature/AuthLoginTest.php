<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;

class AuthLoginTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function setUp(): void
    {
        parent::setUp();
        // Optionally, seed the database or run migrations
    }

    public function test_login_with_valid_credentials_and_verified_email()
    {
        $password = 'Password123!';
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'username' => 'testuser',
            'password' => bcrypt($password),
            'email_verified_at' => now(),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'login' => 'testuser',
            'password' => $password,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success', 'message', 'token', 'user'
            ]);
    }

    public function test_login_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test2@example.com',
            'username' => 'testuser2',
            'password' => bcrypt('Password123!'),
            'email_verified_at' => now(),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'login' => 'testuser2',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'Invalid credentials'
            ]);
    }

    public function test_login_with_unverified_email()
    {
        $password = 'Password123!';
        $user = User::factory()->create([
            'email' => 'test3@example.com',
            'username' => 'testuser3',
            'password' => bcrypt($password),
            'email_verified_at' => null,
        ]);

        $response = $this->postJson('/api/auth/login', [
            'login' => 'testuser3',
            'password' => $password,
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'unverified' => true,
                'email' => 'test3@example.com',
            ]);
    }
}
