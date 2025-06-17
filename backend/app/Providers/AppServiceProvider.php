<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Enable HTTP caching for API responses
        if (!app()->environment('local')) {
            // Set up a global HTTP cache for a reasonable time (15 minutes)
            // For production environments
            $this->app->singleton('cache.headers', function ($app) {
                return new \Symfony\Component\HttpKernel\HttpCache\ResponseCacheStrategy();
            });
        }
    }
}
