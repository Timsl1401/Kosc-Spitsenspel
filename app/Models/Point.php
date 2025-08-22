<?php

namespace App\Models;

use App\Models\Player;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Point extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'match_id', 'amount', 'player_id'];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function match(){
        return $this->belongsTo(SoccerMatch::class, 'match_id');
    }

    public function player(){
        return $this->belongsTo(Player::class);
    }
}