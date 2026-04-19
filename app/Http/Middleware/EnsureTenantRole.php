<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $tenantParam = $request->route('tenant');
        $tenantId = $tenantParam instanceof \App\Models\Tenant ? $tenantParam->id : $tenantParam;
        
        if (!$tenantId) {
            abort(400, 'Tenant ID is missing in route.');
        }

        $user = $request->user();

        if (!$user) {
            abort(403, 'Unauthorized.');
        }

        $tenantUser = $user->tenants()->where('tenant_id', $tenantId)->first();

        if (!$tenantUser) {
            abort(403, 'You do not belong to this tenant.');
        }

        if ($role !== 'any' && $tenantUser->pivot->role !== $role) {
            abort(403, 'Unauthorized role for this tenant action.');
        }

        return $next($request);
    }
}
