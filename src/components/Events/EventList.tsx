import { Stack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { EventCard } from "./EventCard";
import EventDetailsDialog from "./EventDetailsDialog";
import EventLoginDialog from "./EventLoginDialog";
import { EventDetails } from "./EventDetails";
import { useCan, useList, useMany, useOne } from "@refinedev/core";
import { Event } from "../../features/events/event.model";
import { Country, Location } from "../../features/locations/location.model";

export const EventList = () => {
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const { result: eventsData, query } = useList<Event>({
    resource: "events",
    pagination: { pageSize: 10, currentPage: 1, mode: "server" },
    sorters: [{ field: "start_date", order: order }],
    filters: [{ field: "is_published", operator: "eq", value: true }],
  });

  const locationIds = useMemo(() => {
    return eventsData?.data.map((event) => event.locationId) ?? [];
  }, [eventsData]);

  const { data: locationsData, isLoading: locationsLoading } =
    useMany<Location>({
      resource: "locations",
      ids: locationIds,
      queryOptions: {
        enabled: locationIds.length > 0,
      },
    });

  const countryIds = useMemo(() => {
    return (
      locationsData?.data.map((location: Location) => location.countryId) ?? []
    );
  }, [locationsData]);

  const { data: countriesData, isLoading: countriesLoading } = useMany<Country>(
    {
      resource: "countries",
      ids: countryIds,
      queryOptions: {
        enabled: countryIds.length > 0,
      },
    },
  );

  const countriesMap = useMemo(() => {
    const map = new Map<string, Country>();
    countriesData?.data.forEach((country: Country) => {
      map.set(country.id, country);
    });
    return map;
  }, [countriesData]);

  const locationsMap = useMemo(() => {
    const map = new Map<string, Location>();
    locationsData?.data.forEach((location: Location) => {
      map.set(location.id, location);
    });
    return map;
  }, [locationsData]);

  const { data: canAccess } = useCan({ resource: "events", action: "show" });

  const [detailsDialog, setDetailsDialog] = useState<{
    isOpen: boolean;
    event: Event | null;
  }>({ isOpen: false, event: null });

  const [loginDialog, setLoginDialog] = useState<{
    isOpen: boolean;
    event: Event | null;
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
        {events.map((event, index) => {
          const location = locationsMap.get(event.locationId);
          const country = location
            ? countriesMap.get(location.countryId)
            : undefined;
          return (
            <EventCard
              key={event.id ?? index}
              event={event}
              country={country}
              location={location}
              imageUrl={"/assets/images/logos/logo_506.png"}
              onCardClick={() => handleCardClick(event)}
              onAnmeldenClick={() => handleAnmeldenClick(event)}
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
          title={loginDialog.event.title}
        />
      )}
    </>
  );
};

export default EventList;
