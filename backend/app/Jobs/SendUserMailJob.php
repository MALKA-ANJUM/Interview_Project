<?php

namespace App\Jobs;

use App\Mail\SendUserMail;
use App\Services\UserService;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class SendUserMailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, SerializesModels;

    public function handle(UserService $userService)
    {
        // $users = $userService->getUsersForMail();

        // foreach ($users as $user) {
        //     Mail::to($user->email)->queue(new SendUserMail($user));
        // }

        $userService->getUsersForMail()->chunk(100, function ($users) {
            foreach ($users as $user) {
                Mail::to($user->email)->queue(new SendUserMail($user));
            }
        });
    }
}