
import { Card } from "@/components/ui/card";
import EventsHeader from "./events/EventsHeader";
import EventsList from "./events/EventsList";

// Sample events data
const events = [
  {
    id: 1,
    title: "Annual Medical Camp",
    date: "2024-05-15",
    time: "09:00 - 15:00",
    location: "Central Hospital",
    type: "upcoming",
    description: "Annual free medical checkup for all registered pupils"
  },
  {
    id: 2,
    title: "Nutrition Workshop",
    date: "2024-05-20",
    time: "10:00 - 12:00",
    location: "Community Center",
    type: "upcoming",
    description: "Workshop on nutrition for children with sickle cell"
  },
  {
    id: 3,
    title: "Doctor Consultation",
    date: "2024-04-10",
    time: "13:00 - 16:00",
    location: "School Clinic",
    type: "current",
    description: "Special consultation with visiting specialists"
  },

];

const EventsWidget = () => {
  return (
    <Card>
      <EventsHeader />
      <EventsList events={events} />
    </Card>
  );
};

export default EventsWidget;
