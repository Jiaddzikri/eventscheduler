<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::with(['tenant'])
            ->withCount(['participants', 'payments as verified_payments_count' => function($q) {
                $q->where('status', 'VERIFIED');
            }])
            ->latest();

        // Search by Title or Tenant Name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('tenant', function($qt) use ($search) {
                      $qt->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by Tenant
        if ($request->filled('tenant_id')) {
            $query->where('tenant_id', $request->tenant_id);
        }

        // Filter by Status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return Inertia::render('Admin/Events/Index', [
            'events' => $query->paginate(15)->withQueryString(),
            'tenants' => Tenant::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['search', 'tenant_id', 'status']),
        ]);
    }

    public function show(Event $event)
    {
        $event->load(['tenant']);

        // Fetch participants with user info
        $participants = $event->participants()->with('user')->get();

        // Fetch payments with user info
        $payments = $event->payments()->with('user')->latest('payment_date')->get();

        // Calculate Funding Progress
        $totalCollected = $payments->where('status', 'VERIFIED')->sum('amount');
        
        $participantsCount = $participants->whereIn('status', ['registered', 'approved'])->count();
        $targetPerPerson = $event->budget_per_person;
        
        // Ensure we don't calculate based on 0 target
        $totalTarget = $targetPerPerson * $participantsCount;
        $progressPercentage = $totalTarget > 0 ? round(($totalCollected / $totalTarget) * 100, 2) : 0;

        return Inertia::render('Admin/Events/Show', [
            'event' => $event,
            'participants' => $participants,
            'payments' => $payments,
            'funding' => [
                'total_collected' => $totalCollected,
                'total_target' => $totalTarget,
                'percentage' => $progressPercentage,
                'participants_count' => $participantsCount,
            ]
        ]);
    }
}
