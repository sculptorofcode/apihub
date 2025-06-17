<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AddETagHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only add ETag for GET requests with JSON responses
        if ($request->isMethod('GET') && $response->headers->get('Content-Type') === 'application/json') {
            $content = $response->getContent();
            
            // Generate ETag based on response content
            $etag = md5($content);
            $response->setEtag($etag);
            
            // Check if the client's ETag matches our ETag
            if ($request->getETags() && in_array('"'.$etag.'"', $request->getETags())) {
                $response->setStatusCode(304);
                $response->setContent(null);
            }
            
            // Add cache control headers
            $response->headers->addCacheControlDirective('must-revalidate');
            $response->headers->addCacheControlDirective('max-age', 300); // 5 minutes
        }

        return $response;
    }
}
