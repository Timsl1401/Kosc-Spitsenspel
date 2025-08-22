<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use App\Models\Team;
use App\Models\User;
use App\Models\Point;
use App\Models\Period;
use App\Models\Player;
use App\Models\Ranking;
use Illuminate\Http\Request;

class InfoScreenController extends Controller
{
    public function ranking(){
        $period = Period::find(1);
        $users = User::all();
        $players = Player::all();
        $teams = Team::all();
        $points = Point::where('player_id', '!=', 0)->get();
        $goals = Goal::all();

        $total = Ranking::where('period_id', 1)->orderBy('rank')->take(15)->get();

        $period = Period::find(env('SELECTED_PERIOD'));
        $periodTotal = Ranking::where('period_id', $period->id)->orderBy('rank')->take(15)->get();

        $mostSelectedOverall = Player::withCount('users as total_users')->orderByDesc('total_users')->get()->first();

        // total goals
        $totalgoals = Goal::count();

        // most goals
        $mostgoals = $players->sortByDesc(function($player){
            return $player->goals()->count('id');
        })->first();
        $mostgoals = ['key' => $mostgoals->name, 'value' => $mostgoals->goals()->count()];

        // most points
        $mostpointsplayer = $players->sortByDesc(function($player){
            return $player->points()->sum('amount');
        })->first();
        $mostpointsplayer = ['key' => $mostpointsplayer->name, 'value' => $mostpointsplayer->goals()->count('id') * $mostpointsplayer->team->points];

        // team with most points and goals
        $mostpointsteam = [];
        $mostgoalsteam = [];
        foreach ($teams as $team) {
            $mostpointsteam[$team->name] = 0;
            $mostgoalsteam[$team->name] = 0;
        }
        foreach ($goals as $goal) {
            $mostgoalsteam[$goal->player->team->name] += 1;
            $mostpointsteam[$goal->player->team->name] += $goal->amount_points;
        }
        arsort($mostgoalsteam);
        arsort($mostpointsteam);
        $mostpointsteam = ['key' => array_key_first($mostpointsteam), 'value' => $mostpointsteam[array_key_first($mostpointsteam)]];
        $mostgoalsteam = ['key' => array_key_first($mostgoalsteam), 'value' => $mostgoalsteam[array_key_first($mostgoalsteam)]];

        // player highest/lowest worth (most points per million)
        $ratiosLVP = [];
        foreach ($players as $player) {
            if($player->goals->count('id') == 0){
                $ratiosLVP[$player->name] = $player->price;
            } else {
                $ratiosLVP[$player->name] = $player->price / $player->goals->count('id');
            }
        }
        asort($ratiosLVP);
        $lvp = ['key' => array_key_last($ratiosLVP), 'value' => $ratiosLVP[array_key_last($ratiosLVP)]];

        // player highest/lowest worth (most points per million)
        $ratiosMVP = [];
        foreach ($players as $player) {
            if($player->goals->count('id') == 0){
                continue;
            } else {
                $ratiosMVP[$player->name] = $player->price / $player->goals->count('id');
            }
        }
        asort($ratiosMVP);
        $mvp = ['key' => array_key_first($ratiosMVP), 'value' => $ratiosMVP[array_key_first($ratiosMVP)]];

        return view('infoscreens.rankings', compact(
            'total',
            'periodTotal',
            'period',
            'mostSelectedOverall',
            'totalgoals',
            'mostgoals',
            'mostpointsplayer',
            'mostgoalsteam',
            'mostpointsteam',
            'mvp',
            'lvp'
        ));
    }
}