<?php

namespace App\Models;

use App\Models\Ranking;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Period extends Model
{
    use HasFactory;

    public function rankings(){
        return $this->hasMany(Ranking::class);
    }
}