<?php

use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Spatie\Newsletter\NewsletterFacade;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\RankingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SubLeagueController;
use App\Http\Controllers\InfoScreenController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\DashboardNotificationController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/imc', function(){
//     $users = User::where('id', '>', 230)->get();
//     foreach($users as $user) {
//         NewsletterFacade::subscribe($user->email, ['FNAME'=>$user->first_name,'LNAME'=>$user->last_name]);
//     }
// });

Route::get('/', function () {
    return view('welcome');
});

// infoscreens
Route::get('infoscreen/1', [InfoScreenController::class, 'ranking'])->name('infoscreen.1');

// Route::middleware(['auth:sanctum', 'verified'])->get('/dashboard', function () {
//     return view('dashboard');
// })->name('dashboard');

Route::middleware(['auth:sanctum', 'verified'])->group(function(){
    // dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    //ranglijst old
    // Route::get('/ranglijst/{id}', [UserController::class, 'index'])->defaults('id', 1)->name('user.index');

    //ranglijst new
    Route::get('/ranglijst/{id}', [UserController::class, 'indexNew'])->defaults('id', 1)->name('user.index');

    //spelers
    Route::get('/spelers', [PlayerController::class, 'index'])->name('player.index');
    Route::get('/spelers/koop/{id}', [PlayerController::class, 'buyPlayer'])->name('player.buy');
    Route::get('/spelers/verkoop/{id}', [PlayerController::class, 'sellPlayer'])->name('player.sell');
    Route::get('/spelers/{player}', [PlayerController::class, 'view'])->name('player.view');

    // wedstrijden
    Route::get('/wedstrijden', [MatchController::class, 'index'])->name('match.index');

    //gebruiker
    Route::get('/gebruiker/{user}', [UserController::class, 'viewProfile'])->name('user.profile.view');
    Route::get('/mijn-team', [UserController::class, 'showTeam'])->name('user.myteam');

    // nieuws
    Route::get('/nieuws', [ArticleController::class, 'index'])->name('article.index');
    Route::get('nieuws/{article}', [ArticleController::class, 'show'])->name('article.show');

    //subleagues
    Route::get('/subleagues', [SubLeagueController::class, 'index'])->name('subleague.index');
    Route::get('/subleague/aanmaken', [SubLeagueController::class, 'create'])->name('subleague.create');
    Route::get('/subleague/{subleague}', [SubLeagueController::class, 'show'])->name('subleague.show');
    Route::get('/subleague/{subleague}/verlaten', [SubLeagueController::class, 'leave'])->name('subleague.leave');
    Route::get('/subleague/join/{subleague}/{inviteCode}', [SubLeagueController::class, 'join'])->name('subleague.join');
    Route::post('/subleagues', [SubLeagueController::class, 'store'])->name('subleague.store');

    // Statistieken
    Route::get('/statistieken', [StatisticsController::class, 'index'])->name('statistics');

    //info pages
    Route::get('/spelregels', function(){
        return view('rules');
    })->name('rules');
    Route::get('/toevoegen-aan-startscherm', function(){
        return view('add-to-homescreen');
    })->name('add-to-homescreen');
    Route::get('/prijzenpot', function(){
        return view('prizes');
    })->name('prizes');
});

//admin routes
Route::group(['middleware' => ['role:superadmin'], 'prefix' => 'backend'], function(){
    Route::post('/notify-user/{user}', [UserController::class, 'notifyUser'])->name('notify-user');
    Route::get('/wedstrijd-toevoegen', [MatchController::class, 'addMatch'])->name('addmatch');
    Route::get('/nieuws/toevoegen', [ArticleController::class, 'create'])->name('article.create');
    Route::post('/nieuws', [ArticleController::class, 'store'])->name('article.store');
    Route::get('/update-rankings', [RankingController::class, 'updateRankings'])->name('update-rankings');
    Route::get('/reset-transfers', [UserController::class, 'resetTransfers'])->name('reset-transfers');
    Route::get('/notificatie', [DashboardNotificationController::class, 'create'])->name('notification.create');
    Route::post('notificatie', [DashboardNotificationController::class, 'store'])->name('notification.store');
    Route::get('/wedstrijd/{match}/delete', [MatchController::class, 'delete'])->name('match.delete');
    // Route::get('/update-goals-points', function(){
    //     $goals = App\Models\Goal::all();
    //     foreach ($goals as $goal) {
    //         if($goal->match){
    //             $goal->amount_points = $goal->match->team->points;
    //             $goal->save();
    //             echo 'updated' . $goal->id . '<br>';
    //         }

    //     }
    // });
});