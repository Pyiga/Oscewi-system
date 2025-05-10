
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@inertiajs/react";

const EventsHeader = () => {
  return (
    <CardHeader className="pb-2 flex flex-row justify-between items-center">
      <CardTitle className="text-lg font-semibold flex items-center">
        <CalendarIcon className="h-5 w-5 mr-2 text-[#07648c] dark:text-blue-300" />
        Events & Programs
      </CardTitle>
      <Link to="/events">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add Event</span>
        </Button>
      </Link>
    </CardHeader>
  );
};

export default EventsHeader;
