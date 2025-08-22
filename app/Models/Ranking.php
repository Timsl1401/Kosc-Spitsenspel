<?php

namespace App\Models;

use App\Models\User;
use App\Models\Period;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ranking extends Model
{
    use HasFactory;

    protected $fillable = ['rank', 'user_id', 'period_id', 'points', 'team_worth'];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function period(){
        return $this->belongsTo(Period::class);
    }
}