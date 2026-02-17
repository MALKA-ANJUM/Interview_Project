<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ✅ Reset cached roles & permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Roles
        $admin = Role::create(['name' => 'admin']);
        $user  = Role::create(['name' => 'user']);

        // Permissions
        Permission::create(['name' => 'view dashboard']);
        Permission::create(['name' => 'edit users']);
        Permission::create(['name' => 'delete users']);
        Permission::create(['name' => 'show users']);
        Permission::create(['name' => 'user profile']);

        // 3️⃣ Assign Permissions to Roles
        $admin->givePermissionTo(Permission::all()); // admin gets all
        $user->givePermissionTo(['view dashboard', 'user profile']); // user limited

        // 4️⃣ Optional: assign a role to first user
        $firstUser = \App\Models\User::first();
        if ($firstUser) {
            $firstUser->assignRole('admin');
        }

    }
}
