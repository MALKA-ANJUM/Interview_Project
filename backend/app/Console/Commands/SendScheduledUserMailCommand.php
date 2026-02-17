<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Jobs\SendUserMailJob;

class SendScheduledUserMailCommand extends Command
{
    protected $signature = 'users:send-mail';

    protected $description = 'Send scheduled mail to users';

    public function handle()
    {
        SendUserMailJob::dispatch();

        $this->info('Mail job dispatched successfully');
    }
}