<?php

namespace App\Http\Controllers;

use App\Models\SoccerMatch;
use Illuminate\Http\Request;

class MatchController extends Controller
{

    public function index(){
        $matches = SoccerMatch::orderByDesc('created_at')->with('goals')->paginate(12);
        foreach ($matches as $match) {
            $playerGoals = $match->goals->countBy(function($goal){
                return $goal->player->name;
            });
            $match->playerGoals = $playerGoals;
        }
        //dd($matches);
        return view('matches.index', compact('matches'));
    }
    public function addMatch(){
        return view('backend.add-match');
    }

    public function delete(SoccerMatch $match){
        foreach ($match->points as $point) {
            $point->delete();
        }
        foreach ($match->goals as $goal) {
            $goal->delete();
        }
        $match->delete();
        return redirect()->back();
    }
}