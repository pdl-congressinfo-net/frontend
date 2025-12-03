import { Stack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { EventCard } from "./EventCard";
import EventDetailsDialog from "./EventDetailsDialog";
import EventLoginDialog from "./EventLoginDialog";
import { EventDetails } from "./EventDetails";
import { useCan, useList, useMany, useOne } from "@refinedev/core";
import { Event } from "../../features/events/event.model";
import { Country, Location } from "../../features/locations/location.model";
import { EventDTO } from "../../features/events/event.responses";
import { mapEvent } from "../../features/events/event.mapper";

export const EventList = () => {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [isPublished, setIsPublished] = useState<boolean>(true);

  const { data: canUpdateForFilter } = useCan({
    resource: "events",
    action: "update",
  });

  const filters = canUpdateForFilter?.can
    ? undefined
    : [{ field: "is_published", operator: "eq", value: isPublished }];

  const { result: eventsDto, query } = useList<EventDTO>({
    resource: "events",
    pagination: { pageSize: 10, currentPage: 1, mode: "server" },
    sorters: [{ field: "start_date", order: order }],
    filters,
  });

  const eventsData: Event[] = Array.isArray(eventsDto?.data)
    ? (eventsDto?.data as EventDTO[]).map(mapEvent)
    : [];

  const { data: canShow } = useCan({ resource: "events", action: "show" });
  const { data: canUpdate } = useCan({ resource: "events", action: "update" });

  const [detailsDialog, setDetailsDialog] = useState<{
    isOpen: boolean;
    event: Event | null;
  }>({ isOpen: false, event: null });

  const [loginDialog, setLoginDialog] = useState<{
    isOpen: boolean;
    event: Event | null;
  }>({ isOpen: false, event: null });

  const events = eventsData ?? [];

  console.log("Fetched events:", events);

  if (query.isLoading) {
    return <Text>Loading events...</Text>;
  }

  if (query.isError) {
    return <Text>Error loading events.</Text>;
  }

  const handleCardClick = (event: any) => {
    setDetailsDialog({ isOpen: Boolean(canShow?.can), event });
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

      {detailsDialog.event && (
        <EventDetailsDialog
          isOpen={detailsDialog.isOpen}
          onClose={() => setDetailsDialog({ isOpen: false, event: null })}
          title={detailsDialog.event.name}
        >
          <EventDetails />
        </EventDetailsDialog>
      )}

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
