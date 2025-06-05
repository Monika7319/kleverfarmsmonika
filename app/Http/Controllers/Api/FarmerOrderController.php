<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FarmerOrderController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            $farm = $user->farm;

            if (!$farm) {
                return response()->json([
                    'success' => false,
                    'message' => 'Farm not found for this user'
                ], 404);
            }

            // Mock data for orders
            $orders = [
                [
                    'id' => 'ORD-2023-1001',
                    'customer_name' => 'Rahul Sharma',
                    'customer_email' => 'rahul@example.com',
                    'customer_phone' => '+91 98765 43210',
                    'total' => 1249.97,
                    'status' => 'delivered',
                    'payment_status' => 'paid',
                    'payment_method' => 'UPI',
                    'created_at' => '2023-05-15T10:30:00Z',
                    'items_count' => 3,
                ],
                [
                    'id' => 'ORD-2023-1002',
                    'customer_name' => 'Priya Patel',
                    'customer_email' => 'priya@example.com',
                    'customer_phone' => '+91 87654 32109',
                    'total' => 779.98,
                    'status' => 'processing',
                    'payment_status' => 'paid',
                    'payment_method' => 'Credit Card',
                    'created_at' => '2023-05-16T14:45:00Z',
                    'items_count' => 2,
                ],
            ];

            // Apply filters
            if ($request->has('status') && $request->status !== 'all') {
                $orders = array_filter($orders, function($order) use ($request) {
                    return $order['status'] === $request->status;
                });
            }

            return response()->json([
                'success' => true,
                'orders' => array_values($orders)
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function recent()
    {
        try {
            $user = Auth::user();
            $farm = $user->farm;

            if (!$farm) {
                return response()->json([
                    'success' => false,
                    'message' => 'Farm not found for this user'
                ], 404);
            }

            // Mock data for recent orders
            $orders = [
                [
                    'id' => 'ORD-2023-1001',
                    'customer_name' => 'Rahul Sharma',
                    'total' => 1249.97,
                    'status' => 'delivered',
                    'created_at' => '2023-05-15T10:30:00Z',
                ],
                [
                    'id' => 'ORD-2023-1002',
                    'customer_name' => 'Priya Patel',
                    'total' => 779.98,
                    'status' => 'processing',
                    'created_at' => '2023-05-16T14:45:00Z',
                ],
            ];

            return response()->json([
                'success' => true,
                'orders' => $orders
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch recent orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = Auth::user();
            $farm = $user->farm;

            if (!$farm) {
                return response()->json([
                    'success' => false,
                    'message' => 'Farm not found for this user'
                ], 404);
            }

            // Mock order details
            $order = [
                'id' => $id,
                'customer_name' => 'Rahul Sharma',
                'customer_email' => 'rahul@example.com',
                'customer_phone' => '+91 98765 43210',
                'customer_address' => '123 Main Street, Mumbai, Maharashtra 400001',
                'total' => 1249.97,
                'status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => 'UPI',
                'created_at' => '2023-05-15T10:30:00Z',
                'items' => [
                    [
                        'id' => 1,
                        'name' => 'Organic Milk',
                        'quantity' => 2,
                        'price' => 249.99,
                        'total' => 499.98
                    ],
                    [
                        'id' => 2,
                        'name' => 'Farm Eggs',
                        'quantity' => 3,
                        'price' => 150.00,
                        'total' => 450.00
                    ]
                ]
            ];

            return response()->json([
                'success' => true,
                'order' => $order
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        try {
            $user = Auth::user();
            $farm = $user->farm;

            if (!$farm) {
                return response()->json([
                    'success' => false,
                    'message' => 'Farm not found for this user'
                ], 404);
            }

            $request->validate([
                'status' => 'required|string|in:pending,processing,shipped,delivered,cancelled'
            ]);

            // In a real implementation, you would update the order status in the database
            
            return response()->json([
                'success' => true,
                'message' => 'Order status updated successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
