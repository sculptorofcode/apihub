<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'username' => 'admin',
            'email' => 'admin@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'avatar' => 'https://i.pravatar.cc/150?u=admin',
            'bio' => 'Administrator of the API Hub platform',
            'location' => 'San Francisco, USA',
            'website' => 'https://apihub.example.com',
            'phone' => '+1 (555) 123-4567',
            'last_active_at' => now(),
        ]);
    }
}
