<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = Event::all();
        return Inertia::render('Events', [
            'events' => $events
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'required|string',
            'location' => 'required|string|max:255',
            'type' => 'required|in:current,upcoming',
            'description' => 'required|string',
            'status' => 'required|in:current,upcoming,ended',
        ]);

        $event = Event::create($validated);

        return redirect()->back()->with('success', 'Event created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'required|string',
            'location' => 'required|string|max:255',
            'type' => 'required|in:current,upcoming',
            'description' => 'required|string',
            'status' => 'required|in:current,upcoming,ended',
        ]);

        $event->update($validated);

        return redirect()->back()->with('success', 'Event updated successfully.');
    }

    /**
     * Update event status.
     */
    public function updateStatus(Request $request, Event $event)
    {
        $validated = $request->validate([
            'status' => 'required|in:current,upcoming,ended',
        ]);

        $event->update($validated);

        return redirect()->back()->with('success', 'Event status updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        $event->delete();
        return redirect()->back()->with('success', 'Event deleted successfully.');
    }
}
