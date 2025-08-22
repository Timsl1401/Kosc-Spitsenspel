<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SoccerMatch extends Model
{
    use HasFactory;

    protected $table = 'matches';

    public function goals(){
        return $this->hasMany(Goal::class, 'match_id');
    }

    public function team(){
        return $this->belongsTo(Team::class);
    }

    public function points(){
        return $this->hasMany(Point::class, 'match_id');
    }
}