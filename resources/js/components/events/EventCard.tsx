
import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  description: string;
}

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <div className="p-4 border rounded-md bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-[#07648c] dark:text-blue-300">{event.title}</h3>
        <Badge variant={event.type === "current" ? "outline" : "secondary"}>
          {event.type === "current" ? "Current" : "Upcoming"}
        </Badge>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{event.description}</p>
      <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
        <Calendar className="h-3.5 w-3.5 mr-1" />
        <span>{event.date}</span>
        <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
        <span>{event.time}</span>
      </div>
      <div className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{event.location}</div>
    </div>
  );
};

export default EventCard;
