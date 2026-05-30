<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'founder@rethinklab.co'],
            [
                'name'     => 'RethinkLab Founder',
                'email'    => 'founder@rethinklab.co',
                'password' => Hash::make('optic2024'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'demo@optic.ai'],
            [
                'name'     => 'Optic Demo',
                'email'    => 'demo@optic.ai',
                'password' => Hash::make('demo123'),
            ]
        );
    }
}
