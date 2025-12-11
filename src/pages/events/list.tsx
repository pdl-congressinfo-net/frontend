import { IconButton } from "@chakra-ui/react";
import { useEffect } from "react";
import { LuArchive, LuCirclePlus } from "react-icons/lu";
import { useNavigate } from "react-router";
import { EventList } from "../../components/Events/EventList";
import { useLayout } from "../../providers/layout-provider";

const EventListActions = () => {
  const navigate = useNavigate();

  return (
    <>
      <IconButton
        onClick={() => navigate("/events/archive")}
        variant="ghost"
        rounded="full"
        aria-label="Add Event"
        onMouseDown={(e) => e.preventDefault()}
      >
        <LuArchive />
      </IconButton>
      <IconButton
        onClick={() => navigate("/events/create")}
        variant="ghost"
        rounded="full"
        aria-label="Add Event"
      >
        <LuCirclePlus />
      </IconButton>
    </>
  );
};

const EventsListPage = () => {
  const { setTitle, setActions } = useLayout();

  useEffect(() => {
    setTitle("Events");
    setActions(<EventListActions />);
  }, [setTitle, setActions]);

  return <EventList />;
};

export default EventsListPage;
