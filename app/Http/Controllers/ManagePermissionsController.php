<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class ManagePermissionsController extends Controller
{
    private function tableQuery(Request $request): array
    {
        return $request->only(['page', 'per_page', 'sort', 'direction']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Map the front-end column keys to real DB columns for safe sorting.
        $sortable = ['id' => 'id', 'name' => 'name'];
        $sort = $sortable[$request->query('sort')] ?? 'id';
        $direction = $request->query('direction') === 'desc' ? 'desc' : 'asc';

        $permissions = Permission::query()
            ->orderBy($sort, $direction)
            ->paginate($request->integer('per_page', 5))
            ->withQueryString()
            ->through(fn ($permission) => [
                'id' => $permission->id,
                'name' => $permission->name,
            ]);

        return inertia('ManagePermissions/View', compact('permissions'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(['name' => 'required|unique:permissions,name']);

        Permission::create(['name' => $request->name]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
        return redirect()->route('manage-permissions.index', $this->tableQuery($request))->with('success', 'Permission Created!');
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
        $request->validate(['name' => 'required|unique:permissions,name,' . $id]);

        $permission = Permission::findOrFail($id);
        $permission->update(['name' => $request->name]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
        return redirect()->route('manage-permissions.index', $this->tableQuery($request))->with('success', 'Permission Updated!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();

        app(PermissionRegistrar::class)->forgetCachedPermissions();
        return redirect()->route('manage-permissions.index', $this->tableQuery($request))->with('success', 'Permission Deleted!');
    }
}
