import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Edit, Trash } from "lucide-react";
import { router, Head } from "@inertiajs/react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, parse } from "date-fns";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

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
  status: string;
  description: string;
}

interface EventsProps {
  events: Event[];
}

interface EventCardProps {
  event: Event;
  onEditClick: (event: Event) => void;
  onDeleteClick: (eventId: number) => void;
  onStatusChange: (eventId: number, status: string) => void;
}

const EventCard = ({ event, onEditClick, onDeleteClick, onStatusChange }: EventCardProps) => {
  return (
    <Card className="mb-4 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        <div 
          className={`w-full md:w-2 h-2 md:h-full ${
            event.status === 'current' ? 'bg-blue-500' : 
            event.status === 'upcoming' ? 'bg-green-500' : 'bg-gray-500'
          }`}
        ></div>
        <CardContent className="p-4 flex-1">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
            <div>
              <h3 className="text-lg font-medium text-[#07648c] dark:text-blue-300">{event.title}</h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm flex items-center text-gray-600 dark:text-gray-300">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {format(new Date(event.date), 'MMMM d, yyyy')}
                </p>
                <p className="text-sm flex items-center text-gray-600 dark:text-gray-300">
                  <Clock className="h-4 w-4 mr-2" />
                  {event.time}
                </p>
                <p className="text-sm flex items-center text-gray-600 dark:text-gray-300">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Select
                defaultValue={event.status}
                onValueChange={(value) => onStatusChange(event.id, value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onEditClick(event)}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => onDeleteClick(event.id)}>
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{event.description}</p>
        </CardContent>
      </div>
    </Card>
  );
};

const CalendarPicker = ({ 
  selectedDate, 
  onSelect, 
  eventDates = [], 
  className = "" 
}: { 
  selectedDate: Date | undefined, 
  onSelect: (date: Date | undefined) => void,
  eventDates?: Date[],
  className?: string
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border p-3 md:p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-[#008080] dark:text-teal-400">
          {selectedDate ? format(selectedDate, 'MMMM yyyy') : 'Select a date'}
        </h3>
        {selectedDate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelect(undefined)}
            className="text-xs text-[#008080] hover:text-[#008080]/80 dark:text-teal-400 dark:hover:text-teal-300"
          >
            Clear
          </Button>
        )}
      </div>
      <div className="calendar-container">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelect}
          className="rounded-md"
          modifiers={{
            event: (date: Date) => eventDates.some(eventDate => 
              eventDate.getDate() === date.getDate() &&
              eventDate.getMonth() === date.getMonth() &&
              eventDate.getFullYear() === date.getFullYear()
            )
          }}
          modifiersStyles={{
            event: {
              fontWeight: 'bold',
              color: '#008080',
              backgroundColor: '#e6f7f7',
            }
          }}
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium text-[#008080] dark:text-teal-400",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-[#008080] dark:text-teal-400",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-[#008080] dark:text-teal-400 rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100/50 [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected].day-outside)]:bg-gray-800/50 dark:[&:has([aria-selected])]:bg-gray-800",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-[#e6f7f7] dark:hover:bg-teal-900/50",
            day_range_end: "day-range-end",
            day_selected: "bg-[#008080] text-white hover:bg-[#008080] hover:text-white focus:bg-[#008080] focus:text-white dark:bg-teal-600 dark:hover:bg-teal-600 dark:focus:bg-teal-600",
            day_today: "bg-[#e6f7f7] text-[#008080] dark:bg-teal-900/50 dark:text-teal-400",
            day_outside: "day-outside text-gray-500 opacity-50 dark:text-gray-400",
            day_disabled: "text-gray-500 opacity-50 dark:text-gray-400",
            day_range_middle: "aria-selected:bg-[#e6f7f7] aria-selected:text-[#008080] dark:aria-selected:bg-teal-900/50 dark:aria-selected:text-teal-400",
            day_hidden: "invisible",
          }}
        />
      </div>
    </div>
  );
};

const CalendarSection = ({ selectedDate, setSelectedDate, eventDates, filteredEvents }: { 
  selectedDate: Date | undefined, 
  setSelectedDate: (date: Date | undefined) => void,
  eventDates: Date[],
  filteredEvents: Event[]
}) => {
  return (
    <Card className="shadow-sm h-full dark:bg-gray-800">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center text-[#008080] dark:text-teal-400">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Event Calendar
          </CardTitle>
          <Badge variant="outline" className="text-xs border-[#008080] text-[#008080] dark:border-teal-400 dark:text-teal-400">
            {eventDates.length} {eventDates.length === 1 ? 'Event' : 'Events'} this month
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col gap-6">
          <CalendarPicker 
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            eventDates={eventDates}
          />

          {/* Selected Date Events */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#008080] dark:text-teal-400">
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
              </h3>
              <Badge variant="outline" className="text-xs border-[#008080] text-[#008080] dark:border-teal-400 dark:text-teal-400">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'}
              </Badge>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="p-3 border rounded-lg bg-white dark:bg-gray-700 hover:bg-[#e6f7f7] dark:hover:bg-teal-900/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[#008080] dark:text-teal-400 truncate">{event.title}</p>
                        <div className="mt-1 space-y-1">
                          <p className="text-xs flex items-center text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{event.time}</span>
                          </p>
                          <p className="text-xs flex items-center text-gray-500 dark:text-gray-400">
                            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary"
                        className={`whitespace-nowrap ${
                          event.status === 'current' ? 'bg-[#008080] text-white dark:bg-teal-600' :
                          event.status === 'upcoming' ? 'bg-[#e6f7f7] text-[#008080] dark:bg-teal-900/50 dark:text-teal-400' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                        }`}
                      >
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-[#e6f7f7] dark:bg-teal-900/50 rounded-lg">
                  <p className="text-sm text-[#008080] dark:text-teal-400">
                    No events scheduled for this day
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AddEditEventForm = ({ event, onClose }: { event?: Event, onClose: () => void }) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(
    event ? new Date(event.date) : new Date()
  );
  const [time, setTime] = useState<string>(
    event?.time || format(new Date(), 'HH:mm')
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      const data = {
        title: formData.get('title'),
        date: date?.toISOString().split('T')[0],
        time: time,
        location: formData.get('location'),
        type: formData.get('type'),
        status: formData.get('status'),
        description: formData.get('description'),
      };

      if (event) {
        await router.put(`/events/${event.id}`, data, {
          onSuccess: () => {
            toast({
              title: "Success!",
              description: "Event has been updated successfully.",
              variant: "default",
              className: "bg-[#008080] text-white border-none",
            });
            onClose();
          },
          onError: (errors) => {
            toast({
              title: "Error!",
              description: Object.values(errors).join(', '),
              variant: "destructive",
            });
          },
        });
      } else {
        await router.post('/events', data, {
          onSuccess: () => {
    toast({
              title: "Success!",
              description: "Event has been created successfully.",
              variant: "default",
              className: "bg-[#008080] text-white border-none",
    });
    onClose();
          },
          onError: (errors) => {
            toast({
              title: "Error!",
              description: Object.values(errors).join(', '),
              variant: "destructive",
            });
          },
        });
      }
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
          <Label htmlFor="title" className="text-[#008080] dark:text-teal-400">Event Title</Label>
        <Input 
          id="title" 
            name="title"
          defaultValue={event?.title} 
          placeholder="Enter event title" 
          required 
            className="border-[#008080]/20 focus:border-[#008080] dark:border-teal-400/20 dark:focus:border-teal-400"
            disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
          <Label htmlFor="location" className="text-[#008080] dark:text-teal-400">Location</Label>
          <Input 
            id="location" 
            name="location"
            defaultValue={event?.location} 
            placeholder="Enter event location" 
            required 
            className="border-[#008080]/20 focus:border-[#008080] dark:border-teal-400/20 dark:focus:border-teal-400"
            disabled={isSubmitting}
            />
          </div>
      </div>
      
      <div className="space-y-4">
        <Label className="text-[#008080] dark:text-teal-400">Event Date & Time</Label>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CalendarPicker 
            selectedDate={date}
            onSelect={setDate}
            className="w-full"
          />
          <div className="space-y-4">
            <div>
              <Label htmlFor="time" className="text-[#008080] dark:text-teal-400">Time</Label>
              <Input 
                id="time" 
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border-[#008080]/20 focus:border-[#008080] dark:border-teal-400/20 dark:focus:border-teal-400"
                required 
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-[#008080] dark:text-teal-400">Event Type</Label>
              <Select name="type" defaultValue={event?.type || "upcoming"} disabled={isSubmitting}>
                <SelectTrigger className="border-[#008080]/20 focus:border-[#008080] dark:border-teal-400/20 dark:focus:border-teal-400">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status" className="text-[#008080] dark:text-teal-400">Event Status</Label>
              <Select name="status" defaultValue={event?.status || "upcoming"} disabled={isSubmitting}>
                <SelectTrigger className="border-[#008080]/20 focus:border-[#008080] dark:border-teal-400/20 dark:focus:border-teal-400">
                  <SelectValue placeholder="Select event status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-[#008080] dark:text-teal-400">Description</Label>
        <Textarea 
          id="description" 
          name="description"
          defaultValue={event?.description} 
          placeholder="Provide details about the event"
          className="min-h-[120px] border-[#008080]/20 focus:border-[#008080] dark:border-teal-400/20 dark:focus:border-teal-400" 
          required 
          disabled={isSubmitting}
        />
      </div>
      
      <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose} 
          className="w-full sm:w-auto border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-400 dark:hover:text-gray-900"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="w-full sm:w-auto bg-[#008080] hover:bg-[#008080]/90 dark:bg-teal-600 dark:hover:bg-teal-600/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="mr-2">Processing...</span>
              <span className="animate-spin">⌛</span>
            </>
          ) : (
            event ? "Update Event" : "Create Event"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

const Events = ({ events }: EventsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const eventDates = events.map(event => new Date(event.date));

  const currentEvents = events.filter(event => event.status === "current");
  const upcomingEvents = events.filter(event => event.status === "upcoming");
  const endedEvents = events.filter(event => event.status === "ended");
  
  const filteredEvents = selectedDate 
    ? events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === selectedDate.getDate() &&
               eventDate.getMonth() === selectedDate.getMonth() &&
               eventDate.getFullYear() === selectedDate.getFullYear();
      })
    : [];

  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (eventId: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      router.delete(`/events/${eventId}`, {
        onSuccess: () => {
    toast({
      title: "Event Deleted",
            description: "The event has been deleted successfully.",
      variant: "destructive",
          });
        },
      });
    }
  };

  const handleStatusChange = (eventId: number, status: string) => {
    router.put(`/events/${eventId}/status`, { status }, {
      onSuccess: () => {
        toast({
          title: "Status Updated",
          description: "Event status has been updated successfully.",
        });
      },
    });
  };

  const handleAddEvent = () => {
    setSelectedEvent(undefined);
    setIsDialogOpen(true);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Events" />
      <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#07648c] dark:text-blue-300">Events Management</h1>
          <Button onClick={handleAddEvent} className="bg-[#07648c] hover:bg-[#07648c]/90 dark:bg-blue-600 w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add New Event
        </Button>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-1">
            <CalendarSection 
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              eventDates={eventDates}
              filteredEvents={filteredEvents}
            />
        </div>

        <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardContent className="p-4 md:p-6">
          <Tabs defaultValue="current" className="w-full">
                  <TabsList className="w-full flex flex-wrap gap-2 mb-4">
                    <TabsTrigger value="current" className="flex-1 sm:flex-none">Current Programs</TabsTrigger>
                    <TabsTrigger value="upcoming" className="flex-1 sm:flex-none">Upcoming Events</TabsTrigger>
                    <TabsTrigger value="ended" className="flex-1 sm:flex-none">Ended Events</TabsTrigger>
                    <TabsTrigger value="all" className="flex-1 sm:flex-none">All Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current" className="mt-0">
              <div className="space-y-4">
                {currentEvents.length > 0 ? (
                  currentEvents.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onEditClick={handleEditClick}
                      onDeleteClick={handleDeleteClick}
                            onStatusChange={handleStatusChange}
                    />
                  ))
                ) : (
                  <p className="text-center py-8 text-gray-500 dark:text-gray-400">No current programs found.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="upcoming" className="mt-0">
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onEditClick={handleEditClick}
                      onDeleteClick={handleDeleteClick}
                            onStatusChange={handleStatusChange}
                    />
                  ))
                ) : (
                  <p className="text-center py-8 text-gray-500 dark:text-gray-400">No upcoming events found.</p>
                )}
              </div>
            </TabsContent>

                  <TabsContent value="ended" className="mt-0">
                    <div className="space-y-4">
                      {endedEvents.length > 0 ? (
                        endedEvents.map(event => (
                          <EventCard 
                            key={event.id} 
                            event={event} 
                            onEditClick={handleEditClick}
                            onDeleteClick={handleDeleteClick}
                            onStatusChange={handleStatusChange}
                          />
                        ))
                      ) : (
                        <p className="text-center py-8 text-gray-400">No ended events found.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="all" className="mt-0">
              <div className="space-y-4">
                      {events.length > 0 ? (
                        events.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onEditClick={handleEditClick}
                      onDeleteClick={handleDeleteClick}
                            onStatusChange={handleStatusChange}
                    />
                  ))
                ) : (
                  <p className="text-center py-8 text-gray-500 dark:text-gray-400">No events found.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
              </CardContent>
            </Card>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
              {selectedEvent ? 'Edit Event' : 'Add New Event'}
            </DialogTitle>
          </DialogHeader>
          <AddEditEventForm 
            event={selectedEvent} 
            onClose={() => setIsDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
    </AppLayout>
  );
};

export default Events;
