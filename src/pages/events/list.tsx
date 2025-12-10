import { useEffect } from "react";
import { useLayout } from "../../providers/layout-provider";
import { EventList } from "../../components/Events/EventList";

const EventsListPage = () => {
  const { setTitle, setActions } = useLayout();

  useEffect(() => {
    setTitle("Events");
    setActions(null);
  }, [setTitle, setActions]);

  return <EventList />;
};

export default EventsListPage;
