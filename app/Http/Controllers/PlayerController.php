<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Player;
use App\Models\UserLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlayerController extends Controller
{
    public function index(){
        $players = Auth::user()->players;
        $totalTeamCost = $players->sum('price');
        $remainingBudget = config('app.budget') - $totalTeamCost;
        $playersInTeamCount = $players->count();
        $substitutesRemaining = config('app.max_substitutes') - Auth::user()->substitutes;
        return view('players.index', compact('totalTeamCost', 'remainingBudget', 'playersInTeamCount', 'substitutesRemaining'));
    }

    public function buyPlayer($player){
        $canTransfer = \AppHelper::instance()->canTransfer();
        $transferPeriod = \AppHelper::instance()->isTransferPeriod();

        $user = Auth::user();
        $selectedPlayer = Player::find($player);
        $players = $user->players;
        $totalTeamCost = $players->sum('price');
        $remainingBudget = config('app.budget') - $totalTeamCost;
        // check if there is enough budget
        if ($selectedPlayer->price > $remainingBudget) {
            session()->flash('message', 'Speler past niet binnen je budget.');
            return redirect()->route('user.myteam');
        }
        // check if user doesn't have this player in his team already
        if ($user->players()->find($player)) {
            session()->flash('message', 'Je hebt deze speler al in je selectie.');
            return redirect()->route('user.myteam');
        }
        // check if user doesn't have too many players
        if($user->players->count() >= config('app.max_players')){
            session()->flash('message', 'Je hebt al het maximale aantal spelers in je selectie.');
            return redirect()->route('user.myteam');
        }
        // check if player doesn't have too many substitutes
        if($transferPeriod == true && $user->substitutes >= config('app.max_substitutes')){
            session()->flash('message', 'Je hebt al het maximale aantal wissels gedaan in de transferperiode.');
            return redirect()->route('user.myteam');
        }

        if($canTransfer == false){
            session()->flash('message', 'Je kunt nu geen transfer doen.');
            return redirect()->route('user.myteam');
        }

        $user->players()->toggle($player);

        // log player bought
        $log = new UserLog();
        $log->user_id = Auth::user()->id;
        $log->log = 'Gekocht: ' . $selectedPlayer->name;
        $log->save();

        if($transferPeriod == true){
            $user->substitutes++;
            $user->save();
        }

        return redirect()->route('user.myteam');
    }

    public function sellPlayer($player){
        $canTransfer = \AppHelper::instance()->canTransfer();
        if($canTransfer == false){
            session()->flash('message', 'Je kunt nu geen transfer doen.');
            return redirect()->route('user.myteam');
        }
        Auth::user()->players()->toggle($player);

        $selectedPlayer = Player::find($player);
        // log player sold
        $log = new UserLog();
        $log->user_id = Auth::user()->id;
        $log->log = 'Verkocht: ' . $selectedPlayer->name;
        $log->save();

        return redirect()->route('user.myteam');
    }

    public function view(Player $player){
        $stats = [];
        $details = [];

        $stats['Aantal keer geselecteerd'] = $player->getSelectionCount();
        $stats['Aantal goals'] = $player->goals->count();
        $stats['Aantal punten behaald'] = $stats['Aantal goals'] * $player->team->points;
        $stats['Aantal punten behaald'] = $player->goals->sum('amount_points');

        $details['Naam'] = $player->name;
        $details['Team'] = $player->team->name;
        $details['Positie'] = $player->playerPosition->name;
        $details['Leeftijd'] = date_diff(date_create($player->birth_date), date_create('now'))->y;
        return view('players.profile', compact('details', 'stats', 'player'));
    }
}