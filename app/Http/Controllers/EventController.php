<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Payment;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of the resource. (Global Member)
     */
    public function index()
    {
        $events = Event::with('tenant')->latest()->get();
        return Inertia::render('Events/Index', [
            'events' => $events
        ]);
    }

    /**
     * Display the specified resource. (Global Member)
     */
    public function show(Event $event)
    {
        $event->load('tenant');
        $user = auth()->user();
        $participation = $user ? $event->participants()->where('user_id', $user->id)->first() : null;
        $payments = $user && $participation ? $event->payments()->where('user_id', $user->id)->get() : [];
        $totalPaid = collect($payments)->where('status', 'VERIFIED')->sum('amount');

        return Inertia::render('Events/Show', [
            'event' => $event,
            'isParticipant' => (bool)$participation,
            'participationStatus' => $participation->status ?? null,
            'payments' => $payments,
            'totalPaid' => $totalPaid
        ]);
    }

    public function join(Request $request, Event $event)
    {
        $user = $request->user();
        if (!$event->participants()->where('user_id', $user->id)->exists()) {
            $event->participants()->create([
                'user_id' => $user->id,
                'status' => 'registered'
            ]);
        }
        return back()->with('success', 'Berhasil bergabung dengan event!');
    }

    public function pay(Request $request, Event $event)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'proof' => 'required|image|max:2048',
        ]);

        $path = $request->file('proof')->store('payments', 'public');

        Payment::create([
            'event_id' => $event->id,
            'user_id' => $request->user()->id,
            'amount' => $request->amount,
            'proof_of_transfer_url' => $path,
            'status' => 'PENDING',
            'payment_date' => now(),
        ]);

        return back()->with('success', 'Bukti pembayaran berhasil diunggah. Menunggu verifikasi.');
    }

    /**
     * Show the form for creating a new resource. (Manager only)
     */
    public function create(Tenant $tenant)
    {
        return Inertia::render('Tenant/Events/Create', [
            'tenant' => $tenant
        ]);
    }

    /**
     * Store a newly created resource in storage. (Manager only)
     */
    public function store(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'budget_per_person' => 'required|numeric',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $tenant->events()->create($validated);

        return redirect()->route('tenant.dashboard', $tenant->id)->with('success', 'Event dibuat!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tenant $tenant, Event $event)
    {
        return Inertia::render('Tenant/Events/Edit', [
            'tenant' => $tenant,
            'event' => $event
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tenant $tenant, Event $event)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'budget_per_person' => 'required|numeric',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $event->update($validated);

        return redirect()->route('tenant.dashboard', $tenant->id)->with('success', 'Event diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tenant $tenant, Event $event)
    {
        $event->delete();
        return redirect()->route('tenant.dashboard', $tenant->id)->with('success', 'Event dihapus!');
    }
}
