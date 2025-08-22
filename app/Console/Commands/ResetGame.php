<?php

namespace App\Console\Commands;

use App\Models\Goal;
use App\Models\User;
use App\Models\Point;
use App\Models\Period;
use App\Models\Player;
use App\Models\Ranking;
use App\Models\UserLog;
use App\Models\SoccerMatch;
use Illuminate\Support\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ResetGame extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reset:game';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Full game reset';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // reset substitutes
        $users = User::all();
        foreach ($users as $user) {
            $user->substitutes = 0;
        }

        // periods
        $periods = Period::all();
        foreach ($periods as $period) {
            $period->start = Carbon::parse($period->start)->addYear(1);
            $period->end = Carbon::parse($period->end)->addYear(1);
            $period->save();
        }

        // goals
        Goal::truncate();
        // matches
        SoccerMatch::truncate();
        // points
        Point::truncate();
        // rankings
        Ranking::truncate();
        // user_logs
        UserLog::truncate();
        // players
        Player::truncate();
        //player_user
        DB::table('player_user')->truncate();

    }
}