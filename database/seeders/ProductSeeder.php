<?php

namespace Database\Seeders;

use App\Models\Farm;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all farms
        $farms = Farm::all();

        // Categories
        $categories = [
            'Vegetables',
            'Fruits',
            'Dairy',
            'Grains',
            'Herbs',
            'Honey',
            'Preserves',
            'Other',
        ];

        // Units
        $units = [
            'kg',
            'g',
            'piece',
            'dozen',
            'bunch',
            'liter',
            'ml',
            'box',
        ];

        foreach ($farms as $farm) {
            // Create 10-20 products for each farm
            $productCount = rand(10, 20);

            for ($i = 0; $i < $productCount; $i++) {
                $category = $categories[array_rand($categories)];
                $unit = $units[array_rand($units)];
                $price = rand(10, 500) + (rand(0, 99) / 100);
                $discount = rand(0, 5) > 3 ? rand(5, 30) : 0;
                $stock = rand(0, 100);

                Product::create([
                    'farm_id' => $farm->id,
                    'name' => $this->getProductName($category),
                    'category' => $category,
                    'price' => $price,
                    'unit' => $unit,
                    'discount' => $discount,
                    'description' => fake()->paragraph(),
                    'stock' => $stock,
                    'image' => null, // No image in seeder
                    'is_featured' => rand(0, 10) > 7,
                    'is_seasonal' => rand(0, 10) > 7,
                    'is_approved' => $farm->is_verified,
                    'is_active' => true,
                ]);
            }
        }
    }

    /**
     * Get a random product name based on category.
     *
     * @param string $category
     * @return string
     */
    private function getProductName(string $category): string
    {
        $names = [
            'Vegetables' => [
                'Tomatoes', 'Carrots', 'Potatoes', 'Onions', 'Garlic',
                'Spinach', 'Lettuce', 'Cabbage', 'Broccoli', 'Cauliflower',
                'Bell Peppers', 'Cucumbers', 'Eggplant', 'Zucchini', 'Pumpkin',
            ],
            'Fruits' => [
                'Apples', 'Oranges', 'Bananas', 'Grapes', 'Strawberries',
                'Blueberries', 'Raspberries', 'Watermelon', 'Cantaloupe', 'Peaches',
                'Pears', 'Plums', 'Cherries', 'Kiwi', 'Mango',
            ],
            'Dairy' => [
                'Milk', 'Cheese', 'Butter', 'Yogurt', 'Cream',
                'Cottage Cheese', 'Sour Cream', 'Ghee', 'Paneer', 'Buttermilk',
            ],
            'Grains' => [
                'Rice', 'Wheat', 'Oats', 'Barley', 'Corn',
                'Quinoa', 'Millet', 'Rye', 'Buckwheat', 'Amaranth',
            ],
            'Herbs' => [
                'Basil', 'Mint', 'Cilantro', 'Parsley', 'Rosemary',
                'Thyme', 'Sage', 'Oregano', 'Dill', 'Chives',
            ],
            'Honey' => [
                'Wildflower Honey', 'Clover Honey', 'Acacia Honey', 'Manuka Honey', 'Buckwheat Honey',
                'Orange Blossom Honey', 'Lavender Honey', 'Raw Honey', 'Honeycomb', 'Creamed Honey',
            ],
            'Preserves' => [
                'Strawberry Jam', 'Blueberry Jam', 'Apple Butter', 'Marmalade', 'Raspberry Preserves',
                'Peach Preserves', 'Cherry Jam', 'Blackberry Jam', 'Apricot Preserves', 'Fig Jam',
            ],
            'Other' => [
                'Free-Range Eggs', 'Maple Syrup', 'Apple Cider', 'Kombucha', 'Pickles',
                'Sauerkraut', 'Kimchi', 'Salsa', 'Pesto', 'Hummus',
            ],
        ];

        $categoryNames = $names[$category] ?? $names['Other'];
        return $categoryNames[array_rand($categoryNames)];
    }
}
