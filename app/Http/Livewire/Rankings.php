<?php

namespace App\Http\Livewire;

use App\Models\Ranking;
use Illuminate\Support\Facades\Auth;
use Mediconesystems\LivewireDatatables\Column;
use Mediconesystems\LivewireDatatables\NumberColumn;
use Mediconesystems\LivewireDatatables\Http\Livewire\LivewireDatatable;

class Rankings extends LivewireDatatable
{

    public $exportable = false;

    public function builder(){
        $period = $this->params['period'];
        return Ranking::where('period_id', $period)->where('team_worth', '>', 0);
    }

    public function columns()
    {
        if(Auth::user()->hasRole('superadmin')){
            $this->exportable = true;
        }
        return [
            NumberColumn::name('rank')->label('#')->alignCenter()->defaultSort('asc'),
            Column::callback(['user.first_name', 'user.last_name', 'user_id'], function ($first_name, $last_name, $id) {
                return "<a class='font-semibold' href='" . route('user.profile.view', $id) . "'>$first_name $last_name</a>";
            })->label('Naam')
            ->searchable()->unsortable(),
            Column::name('points')->label('Punten')->unsortable(),
            Column::callback('team_worth', function($worth){
                return '€' . number_format($worth, 0, '.', ',');
            })->label('Teamwaarde'),
            Column::name('user.my_team')->label('Team'),
        ];
    }
}