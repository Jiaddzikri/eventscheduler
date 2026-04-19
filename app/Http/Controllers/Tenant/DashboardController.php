<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request, Tenant $tenant)
    {
        $userRole = $request->user()->tenants()->where('tenant_id', $tenant->id)->first()->pivot->role;

        // Base query for manager: Load events separately
        $events = [];
        if ($userRole === 'manager') {
            $query = $tenant->events()->with(['participants', 'payments']);
            
            if ($request->filled('search')) {
                $query->where(function($q) use ($request) {
                    $q->where('title', 'like', '%' . $request->search . '%')
                      ->orWhere('description', 'like', '%' . $request->search . '%');
                });
            }

            if ($request->filled('date_from')) {
                $query->where('start_date', '>=', $request->date_from);
            }

            if ($request->filled('date_to')) {
                $query->where('start_date', '<=', $request->date_to);
            }

            $events = $query->latest('start_date')->paginate(10)->withQueryString();
        }

        // Paginated query for treasurer
        $payments = null;
        if ($userRole === 'treasurer') {
            $query = Payment::query()
                ->whereHas('event', function ($q) use ($tenant) {
                    $q->where('tenant_id', $tenant->id);
                })
                ->with(['user', 'event']);

            // Search by Member Name or Event Title
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->whereHas('user', function ($qu) use ($search) {
                        $qu->where('name', 'like', "%{$search}%");
                    })->orWhereHas('event', function ($qe) use ($search) {
                        $qe->where('title', 'like', "%{$search}%");
                    });
                });
            }

            // Date Range Filter
            if ($request->filled('date_from')) {
                $query->where('payment_date', '>=', $request->date_from);
            }
            if ($request->filled('date_to')) {
                $query->where('payment_date', '<=', $request->date_to);
            }

            $payments = $query->latest('payment_date')->paginate(10)->withQueryString();
        }

        return Inertia::render('Tenant/Dashboard', [
            'tenant' => $tenant,
            'role' => $userRole,
            'events' => $events,
            'payments' => $payments,
            'filters' => $request->only(['search', 'date_from', 'date_to']),
        ]);
    }

    public function verifyPayment(Request $request, Tenant $tenant, Payment $payment)
    {
        $request->validate([
            'status' => 'required|in:VERIFIED,REJECTED',
            'rejection_reason' => 'required_if:status,REJECTED|nullable|string|max:1000'
        ]);

        $payment->update([
            'status' => $request->status,
            'rejection_reason' => $request->status === 'REJECTED' ? $request->rejection_reason : null
        ]);

        return back()->with('success', 'Status pembayaran diubah!');
    }
}
