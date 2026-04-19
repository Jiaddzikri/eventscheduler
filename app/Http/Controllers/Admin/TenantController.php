<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TenantController extends Controller
{
    public function index()
    {
        $tenants = Tenant::latest()->get();
        return Inertia::render('Admin/Tenants/Index', [
            'tenants' => $tenants
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Tenants/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'bank_account_info' => 'nullable|string',
        ]);

        Tenant::create($validated);

        return redirect()->route('admin.tenants.index')->with('success', 'Tenant berhasil dibuat.');
    }

    public function edit(Tenant $tenant)
    {
        return Inertia::render('Admin/Tenants/Edit', [
            'tenant' => $tenant
        ]);
    }

    public function update(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'bank_account_info' => 'nullable|string',
        ]);

        $tenant->update($validated);

        return redirect()->route('admin.tenants.index')->with('success', 'Tenant berhasil diperbarui.');
    }

    public function destroy(Tenant $tenant)
    {
        $tenant->delete();
        return redirect()->route('admin.tenants.index')->with('success', 'Tenant berhasil dihapus.');
    }
}
