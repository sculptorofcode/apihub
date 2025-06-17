<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->name();
        $username = strtolower(str_replace(' ', '', $name)) . fake()->numberBetween(1, 999);
        
        return [
            'name' => $name,
            'username' => $username,
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'avatar' => 'https://i.pravatar.cc/150?u=' . fake()->uuid(),
            'bio' => fake()->paragraph(1),
            'location' => fake()->city() . ', ' . fake()->country(),
            'website' => fake()->url(),
            'phone' => fake()->phoneNumber(),
            'remember_token' => Str::random(10),
            'last_active_at' => now()->subDays(rand(0, 14)),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
