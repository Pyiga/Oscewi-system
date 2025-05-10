import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Events',
        href: '/events',
    },
];

interface Event {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    type: string;
    description: string;
}

export default function Events() {
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        type: 'upcoming',
        description: ''
    });

    // Sample events data - replace with actual data from your backend
    const events: Event[] = [
        {
            id: 1,
            title: "Parent-Teacher Meeting",
            date: "2024-05-15",
            time: "10:00 AM",
            location: "School Hall",
            type: "upcoming",
            description: "Quarterly parent-teacher meeting"
        },
        {
            id: 2,
            title: "Sports Day",
            date: "2024-05-20",
            time: "9:00 AM",
            location: "School Ground",
            type: "upcoming",
            description: "Annual sports day event"
        },
        {
            id: 3,
            title: "Academic Awards",
            date: "2024-05-25",
            time: "2:00 PM",
            location: "Main Auditorium",
            type: "upcoming",
            description: "Annual academic awards ceremony"
        },
        {
            id: 4,
            title: "Health Check-up",
            date: "2024-04-10",
            time: "9:00 AM",
            location: "School Clinic",
            type: "current",
            description: "Regular health check-up for all students"
        },
        {
            id: 5,
            title: "Nutrition Workshop",
            date: "2024-04-15",
            time: "11:00 AM",
            location: "Conference Room",
            type: "current",
            description: "Workshop on healthy eating habits"
        }
    ];

    const handleAddEvent = () => {
        // Here you would typically make an API call to save the event
        console.log('Adding new event:', newEvent);
        setIsAddEventOpen(false);
        setNewEvent({
            title: '',
            date: '',
            time: '',
            location: '',
            type: 'upcoming',
            description: ''
        });
    };

    const currentEvents = events.filter(event => event.type === "current");
    const upcomingEvents = events.filter(event => event.type === "upcoming");

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Events & Programs" />
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-[#008080]">Events & Programs</h1>
                    <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#008080] hover:bg-[#008080]/90 text-white">
                                <Plus className="h-4 w-4 mr-2" />
                                Add New Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-[#008080]">Add New Event</DialogTitle>
                                <DialogDescription>
                                    Fill in the details for the new event or program.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title" className="text-[#008080]">Event Title</Label>
                                    <Input
                                        id="title"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        className="border-[#008080]/20 focus:border-[#008080] focus:ring-[#008080]/20"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="date" className="text-[#008080]">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                        className="border-[#008080]/20 focus:border-[#008080] focus:ring-[#008080]/20"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="time" className="text-[#008080]">Time</Label>
                                    <Input
                                        id="time"
                                        type="time"
                                        value={newEvent.time}
                                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                        className="border-[#008080]/20 focus:border-[#008080] focus:ring-[#008080]/20"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="location" className="text-[#008080]">Location</Label>
                                    <Input
                                        id="location"
                                        value={newEvent.location}
                                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                        className="border-[#008080]/20 focus:border-[#008080] focus:ring-[#008080]/20"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description" className="text-[#008080]">Description</Label>
                                    <Input
                                        id="description"
                                        value={newEvent.description}
                                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                        className="border-[#008080]/20 focus:border-[#008080] focus:ring-[#008080]/20"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsAddEventOpen(false)}
                                    className="border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleAddEvent}
                                    className="bg-[#008080] hover:bg-[#008080]/90 text-white"
                                >
                                    Add Event
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Current Events Section */}
                {currentEvents.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-[#008080] mb-4">Current Programs</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {currentEvents.map((event) => (
                                <Card key={event.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg text-[#008080]">{event.title}</CardTitle>
                                            <Badge variant="outline" className="bg-[#008080]/10 text-[#008080] border-[#008080]/20">
                                                Current
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 mb-4">{event.description}</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {event.date}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Clock className="h-4 w-4 mr-2" />
                                                {event.time}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <MapPin className="h-4 w-4 mr-2" />
                                                {event.location}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upcoming Events Section */}
                {upcomingEvents.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold text-[#008080] mb-4">Upcoming Events</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {upcomingEvents.map((event) => (
                                <Card key={event.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg text-[#008080]">{event.title}</CardTitle>
                                            <Badge variant="secondary" className="bg-[#008080]/10 text-[#008080]">
                                                Upcoming
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 mb-4">{event.description}</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {event.date}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Clock className="h-4 w-4 mr-2" />
                                                {event.time}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <MapPin className="h-4 w-4 mr-2" />
                                                {event.location}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
} 