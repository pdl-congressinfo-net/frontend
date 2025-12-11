import { Stack, Text } from "@chakra-ui/react";
import {
  useCan,
  useCustomMutation,
  useList,
  useTranslation,
} from "@refinedev/core";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Event } from "../../features/events/events.model";
import { EventCard } from "./EventCard";
import { EventCardLoading } from "./EventCardLoading";
import EventLoginDialog from "./EventLoginDialog";

type EventListProps = {
  archive?: boolean;
};

export const EventList = ({ archive }: EventListProps) => {
  const { translate: t } = useTranslation();
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const startDate = useMemo(() => {
    var d: Date;
    if (archive) {
      d = new Date(0);
    } else {
      d = new Date();
    }
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);
  const navigate = useNavigate();
  const location = useLocation();

  const { result: eventsData, query } = useList<Event>({
    resource: "events",
    pagination: { pageSize: 10, currentPage: 1, mode: "server" },
    sorters: [{ field: "start_date", order: order }],
    filters: [{ field: "end_date", operator: "gte", value: startDate }],
  });

  const { result: eventTypesDto } = useList({
    resource: "types",
    meta: {
      parentmodule: "events",
    },
  });

  const { data: canShow } = useCan({ resource: "events", action: "show" });
  const { data: canUpdate } = useCan({ resource: "events", action: "update" });

  const { mutate: publishEvent } = useCustomMutation();

  const [loginDialog, setLoginDialog] = useState<{
    isOpen: boolean;
    event: Event | null;
  }>({ isOpen: false, event: null });

  const events = eventsData ?? [];

  if (query.isLoading) {
    return (
      <Stack gap={4} width="100%">
        <EventCardLoading />
        <EventCardLoading />
        <EventCardLoading />
      </Stack>
    );
  }

  if (query.isError) {
    return <Text>{t("events.errors.loadingError")}</Text>;
  }

  const handleCardClick = (event: any) => {
    navigate(`/events/show/${event.id}`, {
      state: { background: location, event: event, fallback: "/events" },
    });
  };

  const handleParticipateClick = (event: any) => {
    setLoginDialog({ isOpen: true, event });
  };

  const handlePublishClick = (eventId: string, shouldPublish: boolean) => {
    const endpoint = shouldPublish ? "publish" : "unpublish";
    publishEvent(
      {
        url: `/api/v1/events/${eventId}/${endpoint}`,
        method: "post",
        values: {},
      },
      {
        onSuccess: () => {
          query.refetch();
        },
      },
    );
  };

  if (events.total === 0) {
    return <Text>{t("events.messages.noUpcomingEvents")}</Text>;
  }

  return (
    <>
      <Stack gap={4} width="100%">
        {events.data.map((event, index) => {
          return (
            <EventCard
              key={event.id ?? index}
              event={event}
              onCardClick={() => handleCardClick(event)}
              onParticipateClick={() => handleParticipateClick(event)}
              onPublishClick={(shouldPublish) =>
                handlePublishClick(event.id, shouldPublish)
              }
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
