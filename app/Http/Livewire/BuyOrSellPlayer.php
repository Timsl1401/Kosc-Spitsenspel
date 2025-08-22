<?php

namespace App\Http\Livewire;

use Carbon\Carbon;
use App\Models\Player;
use Livewire\Component;
use Illuminate\Support\Facades\Auth;

class BuyOrSellPlayer extends Component
{
    public $playerId = 999999999999;
    public $player;
    public $players;
    public $totalTeamCost;
    public $playersInTeamCount;
    public $remainingBudget;
    public $teams;
    public $canTransfer;
    public $transferPeriod;
    public $substitutesRemaining;

    public $buyPlayerId;
    public $sellPlayerId;

    public function mount(){
        $this->checkTransferPeriod();
        //$this->teams = Teams::all();
        $this->player = Player::find($this->playerId);
        $this->players = Auth::user()->players;
        $this->totalTeamCost = $this->players->sum('price');
        $this->remainingBudget = config('app.budget') - $this->totalTeamCost;
        $this->playersInTeamCount = $this->players->count();
        $this->substitutesRemaining = config('app.max_substitutes') - Auth::user()->substitutes;
        //ray($this->players, $this->totalTeamCost);
    }

    public function checkTransferPeriod(){
        $this->canTransfer = false;
        $this->transferPeriod = false;
        $startDeadline = Carbon::parse(config('app.start_deadline'));
        $transferStart = Carbon::parse(config('app.transfer_start'));
        $transferEnd = Carbon::parse(config('app.transfer_end'));
        $now = Carbon::now();
        if($now <= $startDeadline){
            $this->canTransfer = true;
        }
        if($now >= $transferStart && $now <= $transferEnd){
            $this->canTransfer = true;
            $this->transferPeriod = true;
        }
        //ray($this->canTransfer);
    }

    public function buyPlayerConfirm($id){
        $this->buyPlayerId = $id;
    }

    public function sellPlayerConfirm($id){
        $this->sellPlayerId = $id;
    }

    public function buyPlayer(){
        $user = Auth::user();
        $selectedPlayer = Player::find($this->buyPlayerId);
        // check if there is enough budget
        if ($selectedPlayer->price > $this->remainingBudget) {
            session()->flash('message', 'Speler past niet binnen je budget.');
            return redirect()->route('user.myteam');
        }
        // check if user doesn't have this player in his team already
        if ($user->players()->find($this->buyPlayerId)) {
            session()->flash('message', 'Je hebt deze speler al in je selectie.');
            return redirect()->route('user.myteam');
        }
        // check if user doesn't have too many players
        if($user->players->count() >= config('app.max_players')){
            session()->flash('message', 'Je hebt al het maximale aantal spelers in je selectie.');
            return redirect()->route('user.myteam');
        }
        // check if player doesn't have too many substitutes
        if($this->transferPeriod == true && $user->substitutes >= config('app.max_substitutes')){
            session()->flash('message', 'Je hebt al het maximale aantal wissels gedaan in de transferperiode.');
            return redirect()->route('user.myteam');
        }

        $user->players()->toggle($this->buyPlayerId);
        // log player bought
        $log = new UserLog();
        $log->user_id = Auth::user()->id;
        $log->log = 'Gekocht: ' . $selectedPlayer->name;
        $log->save();

        if($this->transferPeriod == true){
            $user->substitutes++;
            $user->save();
        }

        return redirect()->route('user.myteam');
    }

    public function sellPlayer(){
        Auth::user()->players()->toggle($this->sellPlayerId);
        $selectedPlayer = Player::find($this->sellPlayerId);
        // log player sold
        $log = new UserLog();
        $log->user_id = Auth::user()->id;
        $log->log = 'Verkocht: ' . $selectedPlayer->name;
        $log->save();
        return redirect()->route('user.myteam');
    }

    public function render()
    {
        return view('livewire.buy-or-sell-player');
    }
}