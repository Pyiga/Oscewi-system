import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Link } from "@inertiajs/react";
import EventCard from "./EventCard";

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

interface EventsListProps {
  events: Event[];
}

const EventsList = ({ events }: EventsListProps) => {
  // Sort events by date and get only upcoming events
  const upcomingEvents = events
    .filter(event => event.status === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 2); // Only take the 2 most recent upcoming events

  return (
    <CardContent>
      {upcomingEvents.length > 0 && (
        <>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Upcoming Events</h3>
          <div className="space-y-3">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}
      
      <div className="mt-4 flex justify-end">
        <Link href="/events">
          <Button variant="outline" size="sm" className="text-[#07648c] dark:text-blue-300 border-[#07648c] dark:border-blue-300">
            View All Events
          </Button>
        </Link>
      </div>
    </CardContent>
  );
};

export default EventsList;
