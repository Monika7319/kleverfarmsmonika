<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Harvest extends Model
{
    protected $fillable = [
        'cultivator_id',
        'name',
        'category',
        'price',
        'unit',
        'discount',
        'stock',
        'description',
        'image',
        'is_featured',
        'is_seasonal',
        'is_approved',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount' => 'decimal:2',
        'stock' => 'integer',
        'is_featured' => 'boolean',
        'is_seasonal' => 'boolean',
        'is_approved' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function cultivator()
    {
        return $this->belongsTo(Cultivator::class, 'cultivator_id');
    }

    // Alias for compatibility
    public function farm()
    {
        return $this->cultivator();
    }

    public function getDiscountedPriceAttribute()
    {
        if ($this->discount > 0) {
            return $this->price - ($this->price * $this->discount / 100);
        }
        return $this->price;
    }

    public function getImageUrlAttribute()
    {
        if ($this->image) {
            return asset('harvests/images/' . $this->image);
        }
        return null;
    }

    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeLowStock($query, $threshold = 10)
    {
        return $query->where('stock', '>', 0)->where('stock', '<=', $threshold);
    }
}
