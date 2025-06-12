<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomerOrder;
use App\Models\CustomerOrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CustomerOrderController extends Controller
{
    public function index(Request $request)
    {
        try {
            $customer = $request->user();

            $orders = CustomerOrder::where('customer_id', $customer->id)
                ->with(['orderItems.product'])
                ->orderBy('ordered_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'orders' => $orders
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Request $request, $orderId)
    {
        try {
            $customer = $request->user();

            $order = CustomerOrder::where('customer_id', $customer->id)
                ->where('id', $orderId)
                ->with(['orderItems.product'])
                ->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'order' => $order
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'delivery_address' => 'required|string',
                'delivery_city' => 'required|string',
                'delivery_state' => 'required|string',
                'delivery_zip_code' => 'required|string',
                'delivery_phone' => 'required|string',
                'payment_method' => 'required|string',
                'notes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $customer = $request->user();

            DB::beginTransaction();

            // Calculate total amount
            $totalAmount = 0;
            $orderItems = [];

            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                
                if (!$product || !$product->is_active || !$product->is_approved) {
                    throw new \Exception("Product {$product->name} is not available");
                }

                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Insufficient stock for {$product->name}");
                }

                $unitPrice = $product->price * (1 - $product->discount / 100);
                $itemTotal = $unitPrice * $item['quantity'];
                $totalAmount += $itemTotal;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'total_price' => $itemTotal,
                    'product_name' => $product->name,
                    'product_unit' => $product->unit,
                ];
            }

            // Create order
            $order = CustomerOrder::create([
                'customer_id' => $customer->id,
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'total_amount' => $totalAmount,
                'delivery_address' => $request->delivery_address,
                'delivery_city' => $request->delivery_city,
                'delivery_state' => $request->delivery_state,
                'delivery_zip_code' => $request->delivery_zip_code,
                'delivery_phone' => $request->delivery_phone,
                'payment_method' => $request->payment_method,
                'notes' => $request->notes,
                'ordered_at' => now(),
            ]);

            // Create order items and update stock
            foreach ($orderItems as $orderItem) {
                CustomerOrderItem::create([
                    'order_id' => $order->id,
                    ...$orderItem
                ]);

                // Update product stock
                Product::where('id', $orderItem['product_id'])
                    ->decrement('stock', $orderItem['quantity']);
            }

            DB::commit();

            $order->load(['orderItems.product']);

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'order' => $order
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to place order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
