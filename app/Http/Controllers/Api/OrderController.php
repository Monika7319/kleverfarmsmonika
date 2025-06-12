<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with(['items.product'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'orders' => $orders
        ], 200);
    }

    public function show(Request $request, $id)
    {
        $order = Order::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->with(['items.product'])
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
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string',
            'shipping_city' => 'required|string',
            'shipping_state' => 'required|string',
            'shipping_zip' => 'required|string',
            'shipping_phone' => 'required|string',
            'payment_method' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            $totalAmount = 0;
            $orderItems = [];

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $total = $product->price * $item['quantity'];
                $totalAmount += $total;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'total' => $total
                ];
            }

            $order = Order::create([
                'user_id' => $request->user()->id,
                'order_number' => 'ORD-' . Str::upper(Str::random(8)),
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $request->payment_method,
                'shipping_address' => $request->shipping_address,
                'shipping_city' => $request->shipping_city,
                'shipping_state' => $request->shipping_state,
                'shipping_zip' => $request->shipping_zip,
                'shipping_phone' => $request->shipping_phone,
                'notes' => $request->notes ?? null,
            ]);

            foreach ($orderItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'total' => $item['total']
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'order' => $order->load('items.product')
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
