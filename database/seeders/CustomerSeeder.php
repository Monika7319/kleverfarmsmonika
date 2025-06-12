<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;
use App\Models\WishlistItem;
use App\Models\CustomerOrder;
use App\Models\CustomerOrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\Hash;

class CustomerSeeder extends Seeder
{
    public function run()
    {
        // Create sample customers
        $customer1 = Customer::create([
            'name' => 'Rahul Sharma',
            'email' => 'rahul@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+91 9876543210',
            'address' => '123 MG Road, Koramangala',
            'city' => 'Bangalore',
            'state' => 'Karnataka',
            'zip_code' => '560034',
        ]);

        $customer2 = Customer::create([
            'name' => 'Priya Patel',
            'email' => 'priya@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+91 9876543211',
            'address' => '456 FC Road, Shivajinagar',
            'city' => 'Pune',
            'state' => 'Maharashtra',
            'zip_code' => '411005',
        ]);

        // Get some products for wishlist and orders
        $products = Product::take(5)->get();

        if ($products->count() > 0) {
            // Add wishlist items
            foreach ($products->take(3) as $product) {
                WishlistItem::create([
                    'customer_id' => $customer1->id,
                    'product_id' => $product->id,
                ]);
            }

            // Create sample orders
            $order1 = CustomerOrder::create([
                'customer_id' => $customer1->id,
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'total_amount' => 1249.95,
                'status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => 'UPI',
                'delivery_address' => $customer1->address,
                'delivery_city' => $customer1->city,
                'delivery_state' => $customer1->state,
                'delivery_zip_code' => $customer1->zip_code,
                'delivery_phone' => $customer1->phone,
                'ordered_at' => now()->subDays(7),
                'delivered_at' => now()->subDays(5),
            ]);

            $order2 = CustomerOrder::create([
                'customer_id' => $customer1->id,
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'total_amount' => 839.97,
                'status' => 'processing',
                'payment_status' => 'paid',
                'payment_method' => 'Credit Card',
                'delivery_address' => $customer1->address,
                'delivery_city' => $customer1->city,
                'delivery_state' => $customer1->state,
                'delivery_zip_code' => $customer1->zip_code,
                'delivery_phone' => $customer1->phone,
                'ordered_at' => now()->subDays(2),
            ]);

            // Create order items
            foreach ($products->take(2) as $index => $product) {
                $quantity = $index + 1;
                $unitPrice = $product->price * (1 - $product->discount / 100);
                
                CustomerOrderItem::create([
                    'order_id' => $order1->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $unitPrice * $quantity,
                    'product_name' => $product->name,
                    'product_unit' => $product->unit,
                ]);
            }

            foreach ($products->skip(2)->take(2) as $index => $product) {
                $quantity = $index + 1;
                $unitPrice = $product->price * (1 - $product->discount / 100);
                
                CustomerOrderItem::create([
                    'order_id' => $order2->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $unitPrice * $quantity,
                    'product_name' => $product->name,
                    'product_unit' => $product->unit,
                ]);
            }
        }
    }
}
