<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Goal extends Model
{
    use HasFactory;

    public function match(){
        return $this->belongsTo(SoccerMatch::class);
    }

    public function player(){
        return $this->belongsTo(Player::class);
    }
}