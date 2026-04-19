<?php

namespace App\Http\Controllers;

use App\Models\BalanceTransaction;
use App\Models\EventParticipant;
use App\Models\Tenant;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $transactions = BalanceTransaction::where('user_id', $user->id)
            ->with('event')
            ->latest()
            ->get();

        return Inertia::render('Dashboard', [
            'balance' => $user->balance,
            'transactions' => $transactions
        ]);
    }

    public function myEvents(Request $request)
    {
        $user = $request->user();
        
        $query = EventParticipant::where('user_id', $user->id)
            ->with(['event.tenant']);

        // Search by Event Title
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('event', function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%");
            });
        }

        // Filter by Community (Tenant)
        if ($request->filled('tenant_id')) {
            $tenantId = $request->tenant_id;
            $query->whereHas('event', function($q) use ($tenantId) {
                $q->where('tenant_id', $tenantId);
            });
        }

        // Filter by Date Range
        if ($request->filled('date_from')) {
            $query->whereHas('event', function($q) use ($request) {
                $q->where('start_date', '>=', $request->date_from);
            });
        }
        if ($request->filled('date_to')) {
            $query->whereHas('event', function($q) use ($request) {
                $q->where('start_date', '<=', $request->date_to);
            });
        }

        $myEvents = $query->latest()->paginate(10)->withQueryString();
        $tenants = Tenant::orderBy('name')->get();

        return Inertia::render('Member/MyEvents', [
            'myEvents' => $myEvents,
            'tenants' => $tenants,
            'filters' => $request->only(['search', 'tenant_id', 'date_from', 'date_to'])
        ]);
    }

    public function payments(Request $request)
    {
        $user = $request->user();
        
        $query = Payment::where('user_id', $user->id)
            ->with(['event.tenant']);

        // Search by Event Title
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('event', function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%");
            });
        }

        // Filter by Status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by Community (Tenant)
        if ($request->filled('tenant_id')) {
            $tenantId = $request->tenant_id;
            $query->whereHas('event', function($q) use ($tenantId) {
                $q->where('tenant_id', $tenantId);
            });
        }

        $payments = $query->latest('payment_date')->paginate(10)->withQueryString();
        $tenants = Tenant::orderBy('name')->get();

        return Inertia::render('Member/Payments', [
            'payments' => $payments,
            'tenants' => $tenants,
            'filters' => $request->only(['search', 'status', 'tenant_id'])
        ]);
    }
}
