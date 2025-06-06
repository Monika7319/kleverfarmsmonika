<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Farm extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'user_id',
        'farmName',
        'ownerName',
        'email',
        'phone',
        'password',
        'address',
        'city',
        'state',
        'zip',
        'farmSize',
        'farmType',
        'description',
        'farmingMethods',
        'specialties',
        'images',
        'acceptTerms',
        'latitude',
        'longitude',
        'is_verified',
        'is_active',
        'slug',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_verified' => 'boolean',
        'is_active' => 'boolean',
        'acceptTerms' => 'boolean',
        'farmingMethods' => 'array',
        'specialties' => 'array',
        'images' => 'array',
    ];

    // Relationships
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    // Scopes
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Accessors
    public function getFullAddressAttribute()
    {
        return "{$this->address}, {$this->city}, {$this->state} {$this->zip}";
    }
}
