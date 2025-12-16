import { HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { useOne, useTranslation } from "@refinedev/core";
import { useLocation, useNavigate, useParams } from "react-router";
import { EventType } from "../../../features/events/events.model";

const EventTypeShowPage = () => {
  const { translate: t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { fallback?: string };

  const { result: eventType, query } = useOne<EventType>({
    resource: "types",
    id: id!,
    meta: {
      parentModule: "events",
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
    <VStack align="stretch" gap={4}>
      <HStack>
        <Text fontWeight="bold">Code:</Text>
        <Text>{eventType.code}</Text>
      </HStack>

      <HStack>
        <Text fontWeight="bold">Name ({t("common.translated")}):</Text>
        <Text>{t(`events.types.name.${eventType.code}`)}</Text>
      </HStack>
    </VStack>
  );
};

export default EventTypeShowPage;
