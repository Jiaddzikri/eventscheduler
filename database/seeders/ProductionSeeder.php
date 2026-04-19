<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ProductionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Khusus untuk inisialisasi server produksi.
     */
    public function run(): void
    {
        // Cek apakah admin sudah ada berdasarkan email untuk menghindari duplikasi
        $adminEmail = 'admin@example.com';
        
        if (!User::where('email', $adminEmail)->exists()) {
            User::create([
                'name' => 'Super Admin',
                'email' => $adminEmail,
                'password' => Hash::make('password'), // Silakan segera ganti setelah login pertama
                'role' => 'admin',
                'balance' => 0,
            ]);

            $this->command->info('Akun Super Admin berhasil dibuat!');
            $this->command->warn('Email: ' . $adminEmail);
            $this->command->warn('Password: password');
        } else {
            $this->command->info('Akun Super Admin sudah tersedia.');
        }
    }
}
