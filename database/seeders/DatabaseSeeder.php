<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Main Users
        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $member = User::create([
            'name' => 'Member Budi',
            'email' => 'member@example.com',
            'password' => Hash::make('password'),
            'role' => 'member',
        ]);

        $manager = User::create([
            'name' => 'Manager Andi',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
            'role' => 'member', // Roles in pivot
        ]);

        $treasurer = User::create([
            'name' => 'Treasurer Cinta',
            'email' => 'treasurer@example.com',
            'password' => Hash::make('password'),
            'role' => 'member',
        ]);

        // 2. Create Tenant
        $tenant = Tenant::create([
            'name' => 'Komunitas Pencinta Alam',
            'description' => 'Komunitas hiking dan camping.',
            'bank_account_info' => 'BCA 1234567890 a.n. Pencinta Alam',
        ]);

        // 3. Attach Main Tenant Users (Pivot)
        $tenant->users()->attach([
            $manager->id => ['role' => 'manager'],
            $treasurer->id => ['role' => 'treasurer'],
        ]);

        // 4. Create Dummy Accounts using Factory for various roles
        // Generate extra Managers for the tenant
        $dummyManagers = User::factory(5)->create(['role' => 'member']);
        foreach ($dummyManagers as $m) {
            $tenant->users()->attach($m->id, ['role' => 'manager']);
        }

        // Generate extra Treasurers for the tenant
        $dummyTreasurers = User::factory(5)->create(['role' => 'member']);
        foreach ($dummyTreasurers as $t) {
            $tenant->users()->attach($t->id, ['role' => 'treasurer']);
        }

        // Generate Regular Members
        User::factory(20)->create(['role' => 'member']);

        // 5. Create Event
        Event::create([
            'tenant_id' => $tenant->id,
            'title' => 'Pendakian Gunung Semeru',
            'description' => 'Pendakian massal bulan Agustus.',
            'budget_per_person' => 1500000,
            'start_date' => Carbon::now()->addDays(30),
            'end_date' => Carbon::now()->addDays(35),
        ]);
    }
}
