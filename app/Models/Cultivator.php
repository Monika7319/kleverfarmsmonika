<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class Cultivator extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'farmName', 'ownerName', 'description', 'farmSize', 'farmType',
        'farmingMethods', 'specialties', 'images', 'acceptTerms', 'address', 'city',
        'state', 'zip', 'latitude', 'longitude', 'phone', 'email', 'password',
        'is_verified', 'is_active', 'slug'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'farmingMethods' => 'array',
        'specialties'    => 'array',
        'images'         => 'array',
        'acceptTerms'    => 'boolean',
        'is_verified'    => 'integer',
        'is_active'      => 'boolean',
        'email_verified_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($cultivator) {
            if (empty($cultivator->slug)) {
                $source = trim("{$cultivator->farmName} in {$cultivator->city} {$cultivator->state}");
                $cultivator->slug = Str::slug($source) ?: Str::uuid();
            }
        });

        static::updating(function ($cultivator) {
            if ($cultivator->isDirty(['farmName', 'city', 'state'])) {
                $source = trim("{$cultivator->farmName} in {$cultivator->city} {$cultivator->state}");
                $newSlug = Str::slug($source) ?: Str::uuid();

                if ($cultivator->slug !== $newSlug) {
                    $cultivator->slug = $newSlug;
                }
            }
        });
    }

    public function setPasswordAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['password'] = bcrypt($value);
        }
    }

    public function harvests()
    {
        return $this->hasMany(Harvest::class, 'cultivator_id');
    }

    // Alias for compatibility with existing code
    public function products()
    {
        return $this->harvests();
    }
}
