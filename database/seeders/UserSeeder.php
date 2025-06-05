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
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create farmer user
        User::create([
            'name' => 'Farmer User',
            'email' => 'farmer@example.com',
            'password' => Hash::make('password'),
            'role' => 'farmer',
            'phone' => '1234567890',
            'address' => '123 Farm Road',
            'is_active' => true,
        ]);

        // Create customer user
        User::create([
            'name' => 'Customer User',
            'email' => 'customer@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'is_active' => true,
        ]);

        // Create additional farmers
        User::factory()->count(5)->create([
            'role' => 'farmer',
        ]);

        // Create additional customers
        User::factory()->count(10)->create([
            'role' => 'customer',
        ]);
    }
}
