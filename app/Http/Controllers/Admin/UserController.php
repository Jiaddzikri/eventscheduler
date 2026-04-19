<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('tenants')->latest();

        // Filter by Search (Name or Email)
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by Role
        if ($request->has('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        // Filter by Tenant
        if ($request->has('tenant_id') && $request->tenant_id !== 'all') {
            $query->whereHas('tenants', function ($q) use ($request) {
                $q->where('tenants.id', $request->tenant_id);
            });
        }

        return Inertia::render('Admin/Users/Index', [
            'users' => $query->paginate(10)->withQueryString(),
            'tenants' => Tenant::all(['id', 'name']),
            'filters' => $request->only(['search', 'role', 'tenant_id'])
        ]);
    }

    public function create()
    {
        $tenants = Tenant::all();
        return Inertia::render('Admin/Users/Create', [
            'tenants' => $tenants
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'nullable|string|min:8',
            'role' => 'required|in:admin,member',
            
            // Optional tenant assignment
            'tenant_id' => 'nullable|exists:tenants,id',
            'tenant_role' => 'nullable|required_with:tenant_id|in:manager,treasurer,member',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password'] ?? 'password'),
            'role' => $validated['role'],
            'email_verified_at' => now(), // Automatically verify
        ]);

        if (!empty($validated['tenant_id'])) {
            $user->tenants()->attach($validated['tenant_id'], ['role' => $validated['tenant_role']]);
        }

        return redirect()->route('admin.users.index')->with('success', 'Akun berhasil dibuat.');
    }

    public function edit(User $user)
    {
        // Don't allow editing the super admin through basic UI unless complex logic is added to prevent self-lockout
        $tenants = Tenant::all();
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user->load('tenants'),
            'tenants' => $tenants
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|in:admin,member',
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $user->update($data);

        return redirect()->route('admin.users.index')->with('success', 'Akun berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri!');
        }

        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'Akun berhasil dihapus.');
    }
}
