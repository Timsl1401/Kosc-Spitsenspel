<?php

namespace App\Http\Controllers;

use App\Models\DashboardNotification;
use Illuminate\Http\Request;

class DashboardNotificationController extends Controller
{
    public function create(){
        return view('backend.add-notification');
    }

    public function store(Request $request){
        $notification = new DashboardNotification();
        $notification->notification = $request->notification;
        $notification->save();
        return redirect()->route('dashboard');
    }
}