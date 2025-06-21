<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class OptionalAuthenticate
{
    /**
     * Handle an incoming request with optional authentication.
     * If a valid token is provided, the user will be authenticated.
     * If not, the request will still proceed without authentication.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Attempt to authenticate using sanctum if a bearer token is present
        if ($request->bearerToken()) {
            Auth::shouldUse('sanctum');
            Auth::guard('sanctum')->user();
        }
        // Proceed regardless of authentication status
        return $next($request);
    }
}
