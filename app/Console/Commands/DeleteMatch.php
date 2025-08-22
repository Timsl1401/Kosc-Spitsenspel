<?php

namespace App\Console\Commands;

use App\Models\SoccerMatch;
use Illuminate\Console\Command;

class DeleteMatch extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'match:delete {match}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete match {id}';

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
        if ($this->confirm('Je staat op het punt een wedstrijd te verwijderen, wil je doorgaan?')) {
            $match = SoccerMatch::find($this->argument('match'));
            foreach ($match->points as $point) {
                $point->delete();
            }
            foreach ($match->goals as $goal) {
                $goal->delete();
            }
            $match->delete();
        }
    }
}