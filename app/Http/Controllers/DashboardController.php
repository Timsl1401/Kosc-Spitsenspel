<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\DashboardNotification;
use Carbon\Carbon;
use App\Models\User;
use App\Models\DefaultValue;
use App\Models\Point;
use App\Models\Ranking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(){
        $user = Auth::user();
        $notification = DashboardNotification::latest()->first();
        $articles = Article::orderByDesc('created_at')->take(5)->get();
        $top10 = User::withSum('points as total_points', 'amount')->orderByDesc('total_points')->take(10)->get();
        $myteam = $user->players;
        $position = Ranking::where('period_id', 1)->where('user_id', Auth::user()->id)->select('rank')->first();
        $totalPlayers = User::count();
        $lsu = Point::latest()->first();
        if($lsu){
            $lastScoreUpdate = Carbon::parse(Point::latest()->first()->created_at)->diffForHumans();
        } else {
            $lastScoreUpdate = 'nvt';
        }

        $info = [
            'Totaal deelnemers' => $totalPlayers,
            'Ranglijst positie' => $position->rank ?? 0,
            'Aantal punten behaald' => $user->points()->sum('amount'),
            'Aantal spelers in selectie' => $user->players->count(),
            'Resterend budget' => '€' . number_format(config('app.budget') - $user->players->sum('price'), 0, ',', '.'),
            'Deadline start spel' => config('app.start_deadline') . ' 00:00u',
            'Transferwindow' => (\AppHelper::instance()->canTransfer() ? 'Open' : 'Gesloten'),
            'Laatste score update' => $lastScoreUpdate,
        ];
        return view('dashboard', compact('top10', 'myteam', 'user', 'info', 'articles', 'notification'));
    }
}