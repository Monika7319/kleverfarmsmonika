<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Klever_comment extends Model
{
    use HasFactory;
    protected $table = 'klever_comments'; // ✅ this is plural

    protected $fillable = ['farm_id', 'comment'];

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }
}

