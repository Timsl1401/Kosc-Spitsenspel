<?php

namespace App\Http\Controllers;

use App\Models\SubLeague;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubLeagueController extends Controller
{
    public function show(SubLeague $subleague){
        $total = $subleague->users->sortByDesc(function($user){
            return $user->points()->sum('amount');
        });
        $total = $total->paginate(20);
        return view('subleagues.show', compact('subleague', 'total'));
    }

    public function join(SubLeague $subleague, $inviteCode){
        //dd($subleague, $inviteCode);
        $user = Auth::user();
        if($subleague->users->contains($user->id)){
            session()->flash('message', 'Je bent al deelnemer van deze subleague.');
            return redirect(route('subleague.show', $subleague->id));
        };
        if ($inviteCode == $subleague->invite_code) {
            $user->subleagues()->attach($subleague->id);
            session()->flash('message', 'Je bent nu deelnemer van deze subleague!');
            return redirect(route('subleague.show', $subleague->id));
        }else{
            session()->flash('message', 'Ongeldige code.');
            return redirect(route('subleague.show', $subleague->id));
        };
    }

    public function leave(SubLeague $subleague){
        $user = Auth::user();
        if($user->id == $subleague->user_id){
            session()->flash('message', 'De eigenaar kan de subleague niet verlaten.');
            return redirect(route('subleague.show', $subleague->id));
        }
        $user->subleagues()->detach($subleague->id);
        return redirect(route('subleague.index'));
    }

    public function index(){
        $mySubLeagues = Auth::user()->subleagues;
        $allSubLeagues = SubLeague::paginate(10);
        return view('subleagues.index', compact('mySubLeagues', 'allSubLeagues'));
    }

    public function create(){
        return view('subleagues.create');
    }

    public function store(Request $request){
        $user = Auth::user();
        $request->validate([
            'name' => 'unique:sub_leagues',
        ],
        ['name.unique' => 'Deze subleague naam is al bezet.']);
        $subleague = new SubLeague();
        $subleague->name = $request->name;
        $subleague->user_id = $user->id;
        $subleague->invite_code = Str::random(8);
        $subleague->save();
        $user->subleagues()->attach($subleague->id);
        return redirect(route('subleague.index'));
    }
}