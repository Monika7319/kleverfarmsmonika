<?php

namespace Database\Seeders;

use App\Models\Farm;
use App\Models\User;
use Illuminate\Database\Seeder;

class FarmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the farmer user
        $farmer = User::where('email', 'farmer@example.com')->first();

        // Create a farm for the farmer
        Farm::create([
            'user_id' => $farmer->id,
            'name' => 'Green Valley Farm',
            'description' => 'A sustainable farm producing organic vegetables and fruits.',
            'address' => '123 Farm Road',
            'city' => 'Farmville',
            'state' => 'Agricultural State',
            'zip_code' => '12345',
            'phone' => '1234567890',
            'email' => 'farmer@example.com',
            'website' => 'https://greenvalleyfarm.example.com',
            'is_verified' => true,
            'is_active' => true,
        ]);

        // Create farms for other farmers
        $otherFarmers = User::where('role', 'farmer')
                           ->where('id', '!=', $farmer->id)
                           ->get();

        foreach ($otherFarmers as $otherFarmer) {
            Farm::create([
                'user_id' => $otherFarmer->id,
                'name' => fake()->company() . ' Farm',
                'description' => fake()->paragraph(),
                'address' => fake()->streetAddress(),
                'city' => fake()->city(),
                'state' => fake()->state(),
                'zip_code' => fake()->postcode(),
                'phone' => fake()->phoneNumber(),
                'email' => $otherFarmer->email,
                'website' => 'https://' . fake()->domainName(),
                'is_verified' => fake()->boolean(80),
                'is_active' => true,
            ]);
        }
    }
}
