<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'farm_id',
        'name',
        'price',
        'unit',
        'category',
        'description',
        'discount',
        'stock',
        'featured',
        'seasonal',
        'image',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount' => 'integer',
        'stock' => 'integer',
        'featured' => 'boolean',
        'seasonal' => 'boolean',
    ];

    // Relationships
    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }

    // Scopes
    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeSeasonal($query)
    {
        return $query->where('seasonal', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    public function scopeOutOfStock($query)
    {
        return $query->where('stock', 0);
    }

    public function scopeLowStock($query, $threshold = 5)
    {
        return $query->where('stock', '>', 0)->where('stock', '<=', $threshold);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    // Accessors
    public function getDiscountedPriceAttribute()
    {
        if ($this->discount > 0) {
            return $this->price - ($this->price * $this->discount / 100);
        }
        return $this->price;
    }

    public function getIsInStockAttribute()
    {
        return $this->stock > 0;
    }

    public function getIsLowStockAttribute()
    {
        return $this->stock > 0 && $this->stock <= 5;
    }

    public function getStockStatusAttribute()
    {
        if ($this->stock === 0) {
            return 'out_of_stock';
        } elseif ($this->stock <= 5) {
            return 'low_stock';
        } elseif ($this->stock <= 10) {
            return 'medium_stock';
        } else {
            return 'in_stock';
        }
    }
}
