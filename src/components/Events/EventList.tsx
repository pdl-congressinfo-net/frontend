import { Stack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { EventCard } from "./EventCard";
import EventDetailsDialog from "./EventDetailsDialog";
import EventLoginDialog from "./EventLoginDialog";
import { EventDetails } from "./EventDetails";
import {
  useCan,
  useList,
  useMany,
  useOne,
  useNavigation,
} from "@refinedev/core";
import { useNavigate, useLocation } from "react-router-dom";
import { Event } from "../../features/events/event.model";
import { EventDTO } from "../../features/events/event.responses";
import { mapEvent } from "../../features/events/event.mapper";

export const EventList = () => {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const startDate = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);
  const navigate = useNavigate();
  const location = useLocation();

  const { result: eventsDto, query } = useList<EventDTO>({
    resource: "events",
    pagination: { pageSize: 10, currentPage: 1, mode: "server" },
    sorters: [{ field: "start_date", order: order }],
    filters: [{ field: "end_date", operator: "gte", value: startDate }],
  });

  const eventsData: Event[] = Array.isArray(eventsDto?.data)
    ? (eventsDto?.data as EventDTO[]).map(mapEvent)
    : [];

  const { data: canShow } = useCan({ resource: "events", action: "show" });
  const { data: canUpdate } = useCan({ resource: "events", action: "update" });

  const [loginDialog, setLoginDialog] = useState<{
    isOpen: boolean;
    event: Event | null;
  }>({ isOpen: false, event: null });

  const events = eventsData ?? [];

  if (query.isLoading) {
    return <Text>Loading events...</Text>;
  }

  if (query.isError) {
    return <Text>Error loading events.</Text>;
  }

  const handleCardClick = (event: any) => {
    navigate(`/events/show/${event.id}`, {
      state: { background: location, event: event, fallback: "/events" },
    });
  };

  const handleParticipateClick = (event: any) => {
    setLoginDialog({ isOpen: true, event });
  };

  return (
    <>
      <Stack gap={4} width="80%">
        {events.map((event, index) => {
          return (
            <EventCard
              key={event.id ?? index}
              event={event}
              onCardClick={() => handleCardClick(event)}
              onParticipateClick={() => handleParticipateClick(event)}
            />
          );
        })}
      </Stack>

      {loginDialog.event && (
        <EventLoginDialog
          isOpen={loginDialog.isOpen}
          onClose={() => setLoginDialog({ isOpen: false, event: null })}
          title={loginDialog.event.name}
        />
      )}
    </>
  );
};

export default EventList;
