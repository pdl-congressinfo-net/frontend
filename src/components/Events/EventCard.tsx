import { Box, Button, Card, Flex, Heading, Image } from "@chakra-ui/react";
import { CanAccess } from "@refinedev/core";
import { Event } from "../../features/events/event.model";
import { Country, Location } from "../../features/locations/location.model";

export interface EventCardInterface {
  event: Event;
  location?: Location;
  country?: Country;
  imageUrl?: string;
}

export const EventCard = ({
  event,
  location,
  country,
  imageUrl,
  onCardClick,
  onAnmeldenClick,
}: EventCardInterface & {
  onCardClick?: () => void;
  onAnmeldenClick?: () => void;
}) => {
  return (
    <Card.Root
      size="md"
      borderWidth="1px"
      borderRadius="md"
      dropShadow="md"
      onClick={onCardClick}
      cursor="pointer"
      _hover={{ dropShadow: "lg" }}
    >
      <Flex direction="row" justifyContent="space-between" gap={4} padding={4}>
        <Image
          src={imageUrl}
          alt={event.name}
          borderRadius="md"
          boxSize="150px"
        />
        <Card.Body>
          <Flex direction="row" gap={2} mb={2}>
            <Flex direction="column">
              <Heading size="md">{event.name}</Heading>
              <Box fontSize="sm" color="ui.muted">
                {event.startDate.toDateString()}
              </Box>
            </Flex>
            <Flex direction="column" justifyContent="space-between" ml="auto">
              {location && (
                <Box fontSize="sm" color="ui.muted">
                  {location.name}
                </Box>
              )}
              <CanAccess resource="events" action="login">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAnmeldenClick?.();
                  }}
                >
                  Anmelden
                </Button>
              </CanAccess>
            </Flex>
          </Flex>
        </Card.Body>
      </Flex>
    </Card.Root>
  );
};
