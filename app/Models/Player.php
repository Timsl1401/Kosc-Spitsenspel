<?php

namespace App\Models;

use App\Models\Point;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Player extends Model
{
    use HasFactory;

    public function team(){
        return $this->belongsTo(Team::class);
    }

    public function users(){
        return $this->belongsToMany(User::class);
    }

    public function goals(){
        return $this->hasMany(Goal::class);
    }

    public function playerPosition(){
        return $this->belongsTo(Position::class, 'position');
    }

    public function getSelectionCount(){
        return count($this->users);
    }

    public function points(){
        return $this->hasMany(Point::class);
    }
}