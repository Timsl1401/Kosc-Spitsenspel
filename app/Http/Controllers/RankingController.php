<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Period;
use App\Models\Ranking;
use Illuminate\Http\Request;

class RankingController extends Controller
{
    public function updateRankings(){
        Ranking::truncate();
        $periods = Period::all();
        foreach ($periods as $period) {
            $users = User::all();
            foreach ($users as $user) {
                $user->team_worth = $user->players->sum('price');
                $user->points = $user->points()->whereBetween('created_at', [$period->start, $period->end])->sum('amount');
            }
            $rankings = $users->sortBy([['points', 'desc'],['team_worth', 'asc']]);

            //dump('updated period ' . $period->name);

            foreach ($rankings as $rank => $user) {
                $ranking = new Ranking;
                $ranking->rank = $rank + 1;
                $ranking->period_id = $period->id;
                $ranking->user_id = $user->id;
                $ranking->points = $user->points;
                $ranking->team_worth = $user->team_worth;
                $ranking->save();
            }

            //dump('updated rankings ' . $period->name);
            unset($rankings);
        }
    }
}