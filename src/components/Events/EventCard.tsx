import { Box, Button, Card, Flex, Heading, Image } from "@chakra-ui/react";
import { CanAccess, useOne, useNavigation } from "@refinedev/core";
import { Event } from "../../features/events/events.model";
import { Country, Location } from "../../features/locations/location.model";
import { toDate } from "../../utils/helpers";

export interface EventCardInterface {
  event: Event;
  onCardClick?: () => void;
  onParticipateClick?: () => void;
  onPublishClick?: (isPublic: boolean) => void;
}

export const EventCard = ({
  event,
  onCardClick,
  onParticipateClick,
  onPublishClick,
}: EventCardInterface) => {
  const { edit } = useNavigation();

  const {
    result: location,
    query: { isLoading, isError },
  } = useOne<Location>({
    resource: "locations",
    id: event.locationId,
    queryOptions: {
      enabled: !!event.locationId,
    },
  });

  const { result: country } = useOne<Country>({
    resource: "countries",
    id: location?.countryId || "",
    queryOptions: {
      enabled: !!location?.countryId,
    },
    meta: {
      parentmodule: "locations",
    },
  });

  const imageUrl =
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXZlbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60";

  return (
    <Card.Root
      size="md"
      borderWidth="1px"
      borderRadius="md"
      dropShadow="md"
      onClick={onCardClick}
      cursor="pointer"
      _hover={{ dropShadow: "lg" }}
      backgroundColor={event.isPublic ? "inherit" : "red.100"}
    >
      <Flex direction="row" justifyContent="space-between" gap={4} padding={4}>
        <Image
          src={imageUrl}
          alt={event?.name}
          borderRadius="md"
          boxSize="150px"
        />
        <Card.Body>
          <Flex direction="row" gap={2} mb={2}>
            <Flex direction="column" gap={1} justifyContent={"space-between"}>
              <Flex direction="column">
                <Heading size="md">{event.name}</Heading>
                <Box fontSize="sm" color="ui.muted">
                  {(() => {
                    const s = toDate(event?.startDate);
                    const e = toDate(event?.endDate);

                    if (!s && !e) return "";
                    if (s && e && s === e) return s;
                    return `${s}${s && e ? " - " : ""}${e}`;
                  })()}
                </Box>
              </Flex>
              {location && (
                <Box fontSize="sm" color="ui.muted">
                  {location.name}
                  {country && `, ${country?.name}`}
                </Box>
              )}
            </Flex>
            <Flex direction="column" justifyContent="space-between" ml="auto">
              <Flex direction="column" alignItems="flex-end" mt="auto" gap={2}>
                <CanAccess resource="events" action="participate">
                  <Button
                    width={"8vw"}
                    size="md"
                    onClick={(e) => {
                      e.stopPropagation();
                      onParticipateClick?.();
                    }}
                  >
                    Anmelden
                  </Button>
                </CanAccess>
                <CanAccess resource="events" action="update">
                  <Button
                    width={"8vw"}
                    size="md"
                    onClick={(e) => {
                      e.stopPropagation();
                      edit("events", event.id);
                    }}
                  >
                    Bearbeiten
                  </Button>
                </CanAccess>
                <CanAccess resource="events" action="publish">
                  <Button
                    width={"8vw"}
                    size="md"
                    colorPalette={event.isPublic ? "yellow" : "green"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPublishClick?.(!event.isPublic);
                    }}
                  >
                    {event.isPublic ? "Unpublish" : "Publish"}
                  </Button>
                </CanAccess>
              </Flex>
            </Flex>
          </Flex>
        </Card.Body>
      </Flex>
    </Card.Root>
  );
};
