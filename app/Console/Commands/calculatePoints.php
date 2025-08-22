<?php

namespace App\Console\Commands;

use App\Models\DefaultValue;
use App\Models\Goal;
use App\Models\Point;
use Carbon\Carbon;
use Illuminate\Console\Command;

class calculatePoints extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'calculate:points';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Calculate points for all users';

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
        $goals = Goal::where('points_calculated', '0')->get();

        foreach ($goals as $goal) {
            $amount = $goal->amount_points;
            foreach ($goal->player->users as $user) {
                $point = new Point(['match_id' => $goal->match_id, 'amount' => $amount]);
                $user->points()->save($point);
            }
            $goal->points_calculated = true;
            $goal->save();
        }
        echo 'finished calculating';
    }
}