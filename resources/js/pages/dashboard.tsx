import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import StatisticsSection from '@/components/section-cards';
import BeneficiaryAreaChart from '@/components/area-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RecentBeneficiaries from '@/components/beneficiary/RecentBeneficiaries';
import EventsList from '@/components/events/EventsList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
import { Link } from '@inertiajs/react';
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Event {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    type: string;
    status: string;
    description: string;
}

interface DashboardProps {
    events: Event[];
    recentBeneficiaries: any[];
    statistics: {
        totalPupils: {
            total: number;
            desktop: number;
            mobile: number;
        };
        parents: {
            monthly: Array<{ month: string; value: number }>;
            total: number;
        };
        guardians: {
            active: number;
            inactive: number;
            total: number;
        };
        upcomingPrograms: {
            events: number;
            meetings: number;
            activities: number;
        };
    };
}

export default function Dashboard({ events, recentBeneficiaries, statistics }: DashboardProps) {
    const { toast } = useToast();
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState<string>(format(new Date(), 'HH:mm'));
    const [newEvent, setNewEvent] = useState({
        title: '',
        location: '',
        type: 'upcoming',
        status: 'upcoming',
        description: ''
    });

    const handleAddEvent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data = {
                ...newEvent,
                date: date?.toISOString().split('T')[0],
                time: time,
            };

            await router.post('/events', data, {
                onSuccess: () => {
                    toast({
                        title: "Success!",
                        description: "Event has been created successfully.",
                        variant: "default",
                        className: "bg-[#008080] text-white border-none",
                    });
                    setIsAddEventOpen(false);
                    setNewEvent({
                        title: '',
                        location: '',
                        type: 'upcoming',
                        status: 'upcoming',
                        description: ''
                    });
                    setDate(new Date());
                    setTime(format(new Date(), 'HH:mm'));
                },
                onError: (errors) => {
                    toast({
                        title: "Error!",
                        description: Object.values(errors).join(', '),
                        variant: "destructive",
                    });
                },
            });
        } catch (error) {
            toast({
                title: "Error!",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Welcome Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold text-[#008080]">Beneficiary Profiling System</h1>
                </div>

                {/* Statistics Section */}
                <div className="grid gap-6">
                    <StatisticsSection data={statistics} />
                </div>

                {/* Charts and Recent Activity Section */}
                <div>
                    {/* Beneficiary Chart */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-[#008080]">Beneficiary Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BeneficiaryAreaChart />
                        </CardContent>
                    </Card>
                </div>

                {/* Events and Activities Section */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Recent Beneficiaries */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-[#008080]">Recent Beneficiaries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RecentBeneficiaries beneficiaries={recentBeneficiaries} />
                        </CardContent>
                    </Card>

                    {/* Events List */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-[#008080]">Upcoming Events</CardTitle>
                            <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Plus className="h-5 w-5" />
                                        <span className="sr-only">Add Event</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="text-[#008080]">Add New Event</DialogTitle>
                                        <DialogDescription>
                                            Fill in the details for the new event or program.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleAddEvent} className="space-y-4">
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="title" className="text-[#008080]">Event Title</Label>
                                                <Input
                                                    id="title"
                                                    value={newEvent.title}
                                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                                    className="border-[#008080]/20 focus:border-[#008080] focus:ring-[#008080]/20"
                                                    required
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label className="text-[#008080]">Date & Time</Label>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div className="w-full bg-white rounded-lg border border-[#008080]/20 p-4">
                                                        <div className="mb-2">
                                                            <Label className="text-sm font-medium text-[#008080]">Select Date</Label>
                                                        </div>
                                                        <Calendar
                                                            mode="single"
                                                            selected={date}
                                                            onSelect={setDate}
                                                            className="rounded-md w-full [&_.rdp-button:hover]:bg-[#008080] [&_.rdp-button:hover]:text-white [&_.rdp-button_selected]:bg-[#008080] [&_.rdp-button_selected]:text-white [&_.rdp-nav_button:hover]:bg-[#008080] [&_.rdp-nav_button:hover]:text-white"
                                                            disabled={isSubmitting}
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="bg-white rounded-lg border border-[#008080]/20 p-4">
                                                            <Label htmlFor="time" className="text-sm font-medium text-[#008080] mb-2 block">Time</Label>
                                                            <Input
                                                                id="time"
                                                                type="time"
                                                                value={time}
                                                                onChange={(e) => setTime(e.target.value)}
                                                                className="border-[#008080]/20 focus:border-[#008080] focus:ring-[#008080]/20 w-full"
                                                                required
                                                                disabled={isSubmitting}
                                                            />
                                                        </div>
                                                        <div className="bg-white rounded-lg border border-[#008080]/20 p-4">
                                                            <Label htmlFor="type" className="text-sm font-medium text-[#008080] mb-2 block">Event Type</Label>
                                                            <Select
                                                                value={newEvent.type}
                                                                onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}
                                                                disabled={isSubmitting}
                                                            >
                                                                <SelectTrigger className="border-[#008080]/20 focus:border-[#008080] focus:ring-[#008080]/20 w-full">
                                                                    <SelectValue placeholder="Select event type" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="current">Current</SelectItem>
                                                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="location" className="text-[#008080]">Location</Label>
                                                <Input
                                                    id="location"
                                                    value={newEvent.location}
                                                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                                    className="border-[#008080]/20 focus:border-[#008080] focus:ring-[#008080]/20"
                                                    required
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="description" className="text-[#008080]">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    value={newEvent.description}
                                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                                    className="border-[#008080]/20 focus:border-[#008080] focus:ring-[#008080]/20 min-h-[100px]"
                                                    required
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                                            <Button 
                                                type="button"
                                                variant="outline" 
                                                onClick={() => setIsAddEventOpen(false)}
                                                className="border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white w-full sm:w-auto"
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </Button>
                                            <Button 
                                                type="submit"
                                                className="bg-[#008080] hover:bg-[#008080]/90 text-white w-full sm:w-auto"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <span className="mr-2">Processing...</span>
                                                        <span className="animate-spin">⌛</span>
                                                    </>
                                                ) : (
                                                    "Add Event"
                                                )}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <EventsList events={events} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
