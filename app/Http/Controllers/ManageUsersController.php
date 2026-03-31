<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ManageUsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('ManageUsers/View');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ManageUsers/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'matric_no' => 'required',
            'full_name' => 'required',
            'email' => 'required',
            'mobile_no' => 'required',
            'date_of_birth' => 'required',
            'gender' => 'required',
            'street_address' => 'required',
            'city' => 'required',
            'state' => 'required',
            'postal_code' => 'required',
            'password' => 'required',
            'confirm_password' => 'required'
        ]);
        dd($request);

        // return redirect()->route('manage-users.index')->with('success', 'User Created!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
