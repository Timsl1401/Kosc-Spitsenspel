<?php

namespace App\Http\Livewire;

use Carbon\Carbon;
use App\Models\Goal;
use App\Models\Team;
use App\Models\User;
use App\Models\Point;
use App\Models\Period;
use App\Models\Player;
use App\Models\Ranking;
use Livewire\Component;
use App\Models\SoccerMatch;

class AddMatch extends Component
{
    public $players;
    public $teams;
    public $selectedTeam;
    public $teamObject;
    public $opponent;
    public $endscore;
    public $homeGoals;
    public $awayGoals;
    public $goalscorers = [];
    public $homeAway;
    public $matchDate;
    public $guestPlayerScored = false;
    public $commentsNeeded = false;
    public $comments;
    public $confirmAddMatch = false;

    public function mount(){
        $this->teams = Team::all();
        $this->players = Player::all();
        $this->matchDate = date('Y-m-d');
    }

    public function updatedSelectedTeam(){
        $this->teamObject = Team::find($this->selectedTeam);
        $this->goalscorers = [];
        foreach ($this->players as &$player) {
            $this->goalscorers[$player->id] = 0;
        }
    }

    public function addGoalToPlayer($player){
        $this->goalscorers[$player]++;
    }

    public function removeGoalFromPlayer($player){
        $this->goalscorers[$player]--;
    }

    public function sureAddMatch(){
        $this->confirmAddMatch = true;
    }

    public function addMatchToDatabase(){
        $match = new SoccerMatch();
        $match->date = $this->matchDate;
        $match->team_id = $this->selectedTeam;
        $match->home_goals = $this->homeGoals;
        $match->away_goals = $this->awayGoals;
        $match->home_away = $this->homeAway;
        $match->opponent = $this->opponent;
        $match->comments = $this->comments;
        $match->save();

        foreach ($this->goalscorers as $goalscorer => $goalcount) {
            if($goalscorer == 0){
                continue;
            }
            for ($i=0; $i < $goalcount; $i++) {
                $goal = new Goal();
                $goal->player_id = $goalscorer;
                $goal->match_id = $match->id;
                $goal->points_calculated = false;
                $goal->amount_points = $match->team->points;
                // check if player is from kosc 1,2,3,jo19,jo17 and match-team is NOT kosc 1,2,3,jo19,jo17, if TRUE, player gets no points.
                // $player = Player::find($goalscorer);
                //dd($player->team->id, $match->team->id);
                // if(in_array($player->team->id, [1,2,3,11,12]) && !in_array($match->team->id, [1,2,3,11,12])){
                //     if($player->team->id != $match->team->id){
                //         $goal->amount_points = 0;
                //     }
                // }
                // check if match-team is kosc 1,2,3,jo19,jo17. if not, players from other teams do NOT get points.
                // if(!in_array($match->team->id, [1,2,3,11,12])){
                // $player = Player::find($goalscorer);
                //     if($player->team->id != $match->team->id){
                //         $goal->amount_points = 0;
                //     }
                // }
                $goal->save();
            }
        }
        $this->calcPoints();
        $this->updateRankings();
        session()->flash('message', 'Wedstrijd succesvol toegevoegd.');
        return redirect()->route('addmatch');
    }

    public function calcPoints(){
        $goals = Goal::where('points_calculated', '0')->get();
        foreach ($goals as $goal) {
            $amount = $goal->amount_points;
            $player_id = $goal->player->id;
            foreach ($goal->player->users as $user) {
                $point = new Point(['match_id' => $goal->match_id, 'amount' => $amount, 'player_id' => $player_id]);
                $user->points()->save($point);
            }
            $goal->points_calculated = true;
            $goal->save();
        }
    }

    public function updateRankings(){
        //Ranking::truncate();
        $periods = Period::where('start', '<=', Carbon::parse($this->matchDate))->where('end', '>=', Carbon::parse($this->matchDate))->get();
        foreach ($periods as $period) {
            $period->rankings()->delete();
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

    public function updateRankingsOld(){
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

    public function render()
    {
        return view('livewire.add-match');
    }
}
