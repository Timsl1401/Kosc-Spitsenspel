<?php

namespace App\Http\Livewire;

use App\Models\Team;
use App\Models\Player;
use App\Models\Position;
use Illuminate\Support\Facades\Auth;
use Mediconesystems\LivewireDatatables\Column;
use Mediconesystems\LivewireDatatables\DateColumn;
use Mediconesystems\LivewireDatatables\NumberColumn;
use Mediconesystems\LivewireDatatables\Http\Livewire\LivewireDatatable;

class Players extends LivewireDatatable
{
    public $model = Player::class;

    public function columns()
    {
        return [
            Column::callback(['name', 'id'], function($name, $id){
                return "<a class='font-semibold' href='" . route('player.view', $id) . "'>$name</a>";
            })->filterable(),
            Column::name('team.name')->label('Team')->filterable($this->teams->pluck('name')),
            NumberColumn::callback('price', function($price){
                return '€' . number_format($price, 0, '.', ',');
            })->label('Prijs')->filterable(),
            Column::name('playerPosition.name')->label('Positie')->filterable(['Aanvaller', 'Middenvelder', 'Verdediger', 'Keeper']),
            //DateColumn::name('birth_date')->label('geboortedatum'),
            //NumberColumn::raw('FLOOR(DATEDIFF(NOW(), players.birth_date)/365) AS Leeftijd'),
            NumberColumn::name('goals.id:count')->label('Doelpunten'),
            NumberColumn::name('goals.amount_points:sum')->label('punten'),
            Column::callback(['id'], function($id){
                return view('players.player-actions', ['playerId' => $id]);
            })->label('Actie')
        ];
    }

    public function getTeamsProperty()
    {
        return Team::all();
    }

    public function getPositionsProperty()
    {
        return Position::all();
    }

    public function getGoalsProperty(){
        return Goal::all();
    }

}