<?php

namespace App\Http\Controllers;

use App\Mail\UserNotify;
use App\Models\User;
use App\Models\Point;
use App\Models\Period;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    public function index($id = 1){
        $period = Period::find($id);
        $users = User::all();
        $total = $users->sortByDesc(function($user) use ($period){
            return $user->points()->whereBetween('created_at', [$period->start, $period->end])->sum('amount');
        });
        $total = $total->paginate(20);
        return view('users.index-new', compact('total', 'period'));
    }

    public function indexNew($id = 1){
        $period = Period::find($id);
        $users = User::all();
        return view('users.index', compact('id', 'period'));
    }

    public function showTeam(){
        return view('users.myteam');
    }

    public function viewProfile(User $user){
        $pointsEarned = Point::where('user_id', $user->id)->orderByDesc('id')->get();
        //dd($pointsEarned);
        return view('users.view-profile', compact('user', 'pointsEarned'));
    }

    public function resetTransfers(){
        $users = User::all();
        foreach ($users as $user) {
            $user->substitutes = 0;
            $user->save();
        }
    }

    public function notifyUser(User $user, Request $request){
        $body = $request->emailbody;
        Mail::to($user)->send(new UserNotify($user, $body));
        return redirect()->back();
    }
}