<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Log;

class DailyCleanup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cleanup:daily';
    protected $description = 'Daily cleanup: remove expired tokens, delete old logs, clear temp data';


    /**
     * Execute the console command.
     */
    public function handle()
    {
      try {
          //  Remove expired tokens
        $expiredTokens = PersonalAccessToken::where('expires_at', '<', now())->delete();
        Log::info('Expired tokens deleted', ['count' => $expiredTokens]);

        // Delete old logs (>30 days)
        $logPath = storage_path('logs/laravel.log');
        if (file_exists($logPath)) {
            $thirtyDaysAgo = Carbon::now()->subDays(30);
            $logs = file($logPath);
            $newLogs = [];

            foreach ($logs as $line) {
                preg_match('/\[(.*?)\]/', $line, $matches);
                if (isset($matches[1])) {
                    try {
                        $logDate = Carbon::parse($matches[1]);
                        if ($logDate->greaterThanOrEqualTo($thirtyDaysAgo)) {
                            $newLogs[] = $line;
                        }
                    } catch (\Exception $e) {
                        // Skip lines that Carbon cannot parse
                        $newLogs[] = $line;
                    }
                } else {
                    // Keep lines without date (like stacktrace)
                    $newLogs[] = $line;
                }
            }

            file_put_contents($logPath, implode("", $newLogs));
            Log::info('Old logs deleted older than 30 days');
        }


        // Clear temp data (if you have a temp folder)
        $tempPath = storage_path('app/temp');
        if (is_dir($tempPath)) {
            $files = glob($tempPath . '/*');
            foreach ($files as $file) {
                if (is_file($file)) unlink($file);
            }
            Log::info('Temporary files cleared', ['count' => count($files)]);
        }

         $this->info('Daily cleanup completed successfully!');
      } catch (\Throwable $th) {
        Log::error('Daily cleanup failed', ['error' => $th->getMessage()]);
        $this->error('Daily cleanup failed: ' . $th->getMessage());
      }
    }
}
