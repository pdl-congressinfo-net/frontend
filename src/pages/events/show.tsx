import { useParams, useNavigate, useLocation } from "react-router";
import { useOne, useTranslation } from "@refinedev/core";
import EventDetailsDialog from "../../components/Events/EventDetailsDialog";
import { EventDetails } from "../../components/Events/EventDetails";
import { Event } from "../../features/events/events.model";
import { Spinner } from "@chakra-ui/react";

const EventShowPage = () => {
  const { translate: t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { fallback?: string };

  const { result, query } = useOne<Event>({
    resource: "events",
    id: id!,
  });

  const handleClose = () => {
    navigate(state?.fallback || "/events");
  };

  if (!id) {
    return null;
  }

  if (query.isLoading) {
    return <Spinner />;
  }

  if (!result) {
    return null;
  }

  return (
    <EventDetailsDialog
      isOpen={true}
      onClose={handleClose}
      title={result.name || t("events.details.title")}
    >
      <EventDetails event={result} />
    </EventDetailsDialog>
  );
};

export default EventShowPage;
