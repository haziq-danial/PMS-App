<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class ManageRolesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Map the front-end column keys to real DB columns for safe sorting.
        $sortable = ['id' => 'id', 'roles' => 'name'];
        $sort = $sortable[$request->query('sort')] ?? 'id';
        $direction = $request->query('direction') === 'desc' ? 'desc' : 'asc';

        $roles = Role::query()
            ->with('permissions:id,name')
            ->orderBy($sort, $direction)
            ->paginate($request->integer('per_page', 5))
            ->withQueryString()
            ->through(fn ($role) => [
                'id' => $role->id,
                'roles' => $role->name,
                'permissions' => $role->permissions->pluck('name')->toArray(),
            ]);

        // Options for the "New Role" modal's permission picker.
        $permissions = Permission::all()->map(fn ($permission) => [
            'id' => $permission->id,
            'label' => $permission->name,
        ]);

        return inertia('ManageRoles/View', compact('roles', 'permissions'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(['name' => 'required|unique:roles,name', 'selected_permissions' => 'array']);

        $role = Role::create(['name' => $request->name]);

        if ($request->has('selected_permissions')) {
            $role->syncPermissions($request->selected_permissions);
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
        return redirect()->route('manage-roles.index')->with('success', 'Role Created!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|unique:roles,name,' . $id,
            'selected_permissions' => 'array',
        ]);

        $role = Role::findOrFail($id);
        $role->update(['name' => $request->name]);
        $role->syncPermissions($request->selected_permissions ?? []);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
        return redirect()->route('manage-roles.index')->with('success', 'Role Updated!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        app(PermissionRegistrar::class)->forgetCachedPermissions();
        return redirect()->route('manage-roles.index')->with('success', 'Role Deleted!');
    }
}
