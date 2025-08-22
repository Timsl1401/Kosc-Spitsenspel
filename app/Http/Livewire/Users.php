<?php

namespace App\Http\Livewire;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Mediconesystems\LivewireDatatables\Column;
use Mediconesystems\LivewireDatatables\NumberColumn;
use Mediconesystems\LivewireDatatables\Http\Livewire\LivewireDatatable;

class Users extends LivewireDatatable

{
    //public $model = User::class;

    public function builder(){
        $period = $this->params['period'];

        $x = User::query()
        ->select(DB::raw('users.*, SUM(points.amount) as amount'))
        ->groupBy('users.id')
        ->join('points',function($join) use ($period){
            $join->on('users.id', '=', 'points.user_id')
            ->whereBetween('points.created_at', [$period->start, $period->end]);
        })
        // ->addSelect(DB::raw("users.*, @i := coalesce(@i + 1, 1) ranking"))
        ;
        //dd($x->get());
        return $x;
    }

    public function columns()
    {
        return [
            NumberColumn::name('points.amount:sum')->label('Punten')->alignCenter(),
            Column::callback(['first_name', 'last_name'], function ($first_name, $last_name) {
                return "$first_name $last_name";
            })->label('Naam')
            ->searchable(),
            Column::callback('players.price:sum', function($worth){
                return '€' . number_format($worth, 0, '.', ',');
            })->label('Teamwaarde'),
            Column::callback('my_team', function($my_team){
                return $my_team;
            })->label('Team'),
            // Column::callback('id', function($id){
            //     return $id;
            // })->label('id')
        ];
    }
}