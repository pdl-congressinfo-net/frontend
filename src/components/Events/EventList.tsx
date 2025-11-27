import { Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { EventCard } from "./EventCard";
import EventDetailsDialog from "./EventDetailsDialog";
import EventLoginDialog from "./EventLoginDialog";
import { EventDetails } from "./EventDetails";
import { useCan, useList, useOne } from "@refinedev/core";

interface Event {
  id: string;
  name: string;
  start_date: Date;
  end_date: Date;
  location_id: string;
  cathegory_id: string;
}

interface Location {}

export const EventList = () => {
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const { result: eventsData, query } = useList<Event>({
    resource: "events",
    pagination: { pageSize: 10, currentPage: 1, mode: "server" },
    sorters: [{ field: "start_date", order: order }],
    filters: [{ field: "is_published", operator: "eq", value: true }],
  });

  const { data: canAccess } = useCan({ resource: "events", action: "show" });

  const [detailsDialog, setDetailsDialog] = useState<{
    isOpen: boolean;
    event: any | null;
  }>({ isOpen: false, event: null });

  const [loginDialog, setLoginDialog] = useState<{
    isOpen: boolean;
    event: any | null;
  }>({ isOpen: false, event: null });

  const events = eventsData?.data || [];

  if (query.isLoading) {
    return <Text>Loading events...</Text>;
  }

  if (query.isError) {
    return <Text>Error loading events.</Text>;
  }

  const handleCardClick = (event: any) => {
    setDetailsDialog({ isOpen: Boolean(canAccess?.can), event });
  };

  const handleAnmeldenClick = (event: any) => {
    setLoginDialog({ isOpen: true, event });
  };

  return (
    <>
      <Stack gap={4} width="80%">
        {events.map((event, index) => (
          <EventCard
            key={index}
            title={event.name}
            date={event.start_date.toDateString()}
            location={event.location_id}
            imageUrl={"/assets/images/logos/logo_506.png"}
            onCardClick={() => handleCardClick(event)}
            onAnmeldenClick={() => handleAnmeldenClick(event)}
          />
        ))}
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
          title={loginDialog.event.title}
        />
      )}
    </>
  );
};

export default EventList;
