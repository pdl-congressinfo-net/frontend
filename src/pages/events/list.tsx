import { useEffect } from "react";
import { useLayout } from "../../providers/layout-provider";
import { EventList } from "../../components/Events/EventList";
import { IconButton } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { LuArchive, LuCirclePlus } from "react-icons/lu";

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
