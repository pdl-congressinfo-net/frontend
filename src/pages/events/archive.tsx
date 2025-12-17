import { IconButton } from "@chakra-ui/react";
import { useNavigation } from "@refinedev/core";
import { useEffect } from "react";
import { LuCirclePlus, LuClipboardPenLine } from "react-icons/lu";
import { useNavigate } from "react-router";
import { EventList } from "../../components/Events/EventList";
import { useLayout } from "../../providers/layout-provider";

const EventArchiveListActions = () => {
  const navigate = useNavigate();
  const { create, list } = useNavigation();

  return (
    <>
      <IconButton
        onClick={() => list("events")}
        variant="ghost"
        rounded="full"
        aria-label="Add Event"
        onMouseDown={(e) => e.preventDefault()}
      >
        <LuClipboardPenLine />
      </IconButton>
      <IconButton
        onClick={() => create("events")}
        variant="ghost"
        rounded="full"
        aria-label="Add Event"
      >
        <LuCirclePlus />
      </IconButton>
    </>
  );
};

const EventsArchiveListPage = () => {
  const { setTitle, setActions } = useLayout();

  useEffect(() => {
    setTitle("Events");
    setActions(<EventArchiveListActions />);
  }, [setTitle, setActions]);

  return <EventList archive />;
};

export default EventsArchiveListPage;
