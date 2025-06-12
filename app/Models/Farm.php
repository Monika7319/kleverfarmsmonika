<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class Farm extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'farmName', 'ownerName', 'description', 'farmSize', 'farmType',
        'farmingMethods', 'specialties', 'images', 'acceptTerms', 'address', 'city',
        'state', 'zip', 'latitude', 'longitude', 'phone', 'email', 'password',
        'is_verified', 'is_active', 'slug'
    ];

    protected $casts = [
        'farmingMethods' => 'array',
        'specialties'    => 'array',
        'images'         => 'array',
        'acceptTerms'    => 'boolean',
        'is_verified'    => 'integer',
        'is_active'      => 'boolean',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($farm) {
            if (empty($farm->slug)) {
                $source = trim("{$farm->farmName} in {$farm->city} {$farm->state}");
                $farm->slug = Str::slug($source) ?: Str::uuid();
            }
        });

        static::updating(function ($farm) {
            if ($farm->isDirty(['farmName', 'city', 'state'])) {
                $source = trim("{$farm->farmName} in {$farm->city} {$farm->state}");
                $newSlug = Str::slug($source) ?: Str::uuid();

                if ($farm->slug !== $newSlug) {
                    $farm->slug = $newSlug;
                }
            }
        });
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'farm_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'farm_id');
    }
}
