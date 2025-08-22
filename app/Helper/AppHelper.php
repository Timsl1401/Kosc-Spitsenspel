<?php

namespace App\Helper;

use Carbon\Carbon;

class AppHelper
{
    public function canTransfer(){
        $startDeadline = Carbon::parse(config('app.start_deadline'));
        $now = Carbon::now();
        if($now <= $startDeadline){
            return true;
        } else {
            if($now->dayOfWeek == Carbon::SUNDAY || $now->dayOfWeek == Carbon::SATURDAY){
                return false;
            } else {
                return true;
            }
        }
    }

    public function isTransferPeriod(){
        $startDeadline = Carbon::parse(config('app.start_deadline'));
        $now = Carbon::now();
        if($now <= $startDeadline){
            return false;
        } else {
            return true;
        }
    }

    public static function instance()
     {
         return new AppHelper();
     }
}