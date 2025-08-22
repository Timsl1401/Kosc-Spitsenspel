<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use App\Models\Player;
use App\Models\SubLeague;
use Illuminate\Http\Request;

class StatisticsController extends Controller
{
    public function index(){
        // defaults
        $players = Player::all();

        // total goals
        $totalgoals = Goal::count();

        // most goals
        $mostgoals = $players->sortByDesc(function($player){
            return $player->goals()->count('id');
        })->first();
        $mostgoals = ['key' => $mostgoals->name, 'value' => $mostgoals->goals()->count()];

        // most points
        $mostpointsplayer = $players->sortByDesc(function($player){
            return $player->goals()->count('id') * $player->team->points;
        })->first();
        $mostpointsplayer = ['key' => $mostpointsplayer->name, 'value' => $mostpointsplayer->goals()->count('id') * $mostpointsplayer->team->points];

        // most selected players
        $mostSelectedOverall = Player::withCount('users as total_users')->orderByDesc('total_users')->take(10)->get();
        $mostSelectedAttacker = Player::where('position', 1)->withCount('users as total_users')->orderByDesc('total_users')->take(10)->get();
        $mostSelectedMidfielder = Player::where('position', 2)->withCount('users as total_users')->orderByDesc('total_users')->take(10)->get();
        $mostSelectedDefender = Player::where('position', 3)->withCount('users as total_users')->orderByDesc('total_users')->take(10)->get();
        $mostSelectedKeeper = Player::where('position', 4)->withCount('users as total_users')->orderByDesc('total_users')->take(10)->get();
        //$position = User::withSum('points as total_points', 'amount')->orderByDesc('total_points')->get();

        return view('statistics.index', compact(
            'totalgoals',
            'mostgoals',
            'mostpointsplayer',
            'mostSelectedOverall',
            'mostSelectedAttacker',
            'mostSelectedMidfielder',
            'mostSelectedDefender',
            'mostSelectedKeeper'
        ));
    }
}