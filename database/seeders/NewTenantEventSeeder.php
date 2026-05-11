<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class NewTenantEventSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create New Tenant
        $tenant = Tenant::create([
            'name' => 'Klub Robotik Nusantara',
            'description' => 'Komunitas inovasi robotika dan AI.',
            'bank_account_info' => 'Mandiri 9876543210 a.n. Klub Robotik',
        ]);

        // 2. Create New Manager for this Tenant
        $manager = User::create([
            'name' => 'Manager Robotik',
            'email' => 'robot@example.com',
            'password' => Hash::make('password'),
            'role' => 'member',
        ]);

        $tenant->users()->attach($manager->id, ['role' => 'manager']);

        // 3. Create New Event for this Tenant
        Event::create([
            'tenant_id' => $tenant->id,
            'title' => 'Kompetisi Robotika Nasional 2026',
            'description' => 'Ajang kompetisi robotika tingkat nasional untuk kategori Line Follower dan Battle Robot.',
            'budget_per_person' => 500000,
            'start_date' => Carbon::now()->addMonths(2),
            'end_date' => Carbon::now()->addMonths(2)->addDays(3),
            'status' => 'active',
        ]);

        $this->command->info('Tenant, Manager, and Event successfully created!');
        $this->command->warn('Manager Email: robot@example.com');
        $this->command->warn('Password: password');
    }
}
