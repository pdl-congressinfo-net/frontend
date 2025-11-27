import { Box, Button, Card, Flex, Heading, Image } from "@chakra-ui/react";
import { CanAccess } from "@refinedev/core";

const EventCardInterface = {
  title: "Sample Event",
  date: "2024-07-15",
  location: "New York, NY",
  imageUrl: "/assets/images/logos/logo_506.png",
};

interface Event {
  id: string;
  name: string;
  start_date: Date;
  end_date: Date;
  location_id: string;
  cathegory_id: string;
}

export const EventCard = ({
  title,
  date,
  location,
  imageUrl,
  onCardClick,
  onAnmeldenClick,
}: typeof EventCardInterface & {
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
        <Image src={imageUrl} alt={title} borderRadius="md" boxSize="150px" />
        <Card.Body>
          <Flex direction="row" gap={2} mb={2}>
            <Flex direction="column">
              <Heading size="md">{title}</Heading>
              <Box fontSize="sm" color="ui.muted">
                {date}
              </Box>
            </Flex>
            <Flex direction="column" justifyContent="space-between" ml="auto">
              <Box fontSize="sm" color="ui.muted">
                {location}
              </Box>
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
