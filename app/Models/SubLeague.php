<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubLeague extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'user_id', 'invite_code'];

    public function users(){
        return $this->belongsToMany(User::class);
    }
}