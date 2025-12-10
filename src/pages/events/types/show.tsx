import { useParams, useNavigate, useLocation } from "react-router";
import { useOne } from "@refinedev/core";
import { VStack, Text, Spinner, HStack } from "@chakra-ui/react";
import { EventType } from "../../../features/events/events.model";
import EventDetailsDialog from "../../../components/Events/EventDetailsDialog";

const EventTypeShowPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { fallback?: string };

  const { result: eventType, query } = useOne<EventType>({
    resource: "types",
    id: id!,
    meta: {
      parentmodule: "events",
    },
  });

  const handleClose = () => {
    navigate(state?.fallback || "/events/types");
  };

  if (query.isLoading) {
    return <Spinner />;
  }

  if (!eventType) {
    return null;
  }

  return (
    <EventDetailsDialog
      isOpen={true}
      onClose={handleClose}
      title="Event Type Details"
    >
      <VStack align="stretch" gap={4}>
        <HStack>
          <Text fontWeight="bold">Code:</Text>
          <Text>{eventType.code}</Text>
        </HStack>

        <HStack>
          <Text fontWeight="bold">Name (German):</Text>
          <Text>{eventType.nameDe}</Text>
        </HStack>

        <HStack>
          <Text fontWeight="bold">Name (English):</Text>
          <Text>{eventType.nameEn}</Text>
        </HStack>

        {eventType.descriptionDe && (
          <VStack align="stretch">
            <Text fontWeight="bold">Description (German):</Text>
            <Text>{eventType.descriptionDe}</Text>
          </VStack>
        )}

        {eventType.descriptionEn && (
          <VStack align="stretch">
            <Text fontWeight="bold">Description (English):</Text>
            <Text>{eventType.descriptionEn}</Text>
          </VStack>
        )}
      </VStack>
    </EventDetailsDialog>
  );
};

export default EventTypeShowPage;
