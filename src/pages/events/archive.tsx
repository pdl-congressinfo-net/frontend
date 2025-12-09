import { useCan } from "@refinedev/core";
import EventList from "../../components/Events/EventList";
import { Button, Flex, Heading } from "@chakra-ui/react";
import { LuCirclePlus } from "react-icons/lu";
import { Link } from "react-router";

type Props = {};
const EventsArchivePage = ({}: Props) => {
  const { data: canAccess } = useCan({
    resource: "events",
    action: "create",
  });
  return (
    <>
      <Flex justify="space-between" mb={4}>
        <Heading>Events Archive</Heading>
        {canAccess && (
          <Link to="/events/create">
            <Button
              variant="ghost"
              rounded="full"
              mb={4}
              _hover={{
                transform: "scale(1.2)",
                transition: "transform 0.15s ease-in-out",
                backgroundColor: "transparent",
              }}
              _active={{ transform: "scale(1.1)" }}
            >
              <LuCirclePlus size={44} />
            </Button>
          </Link>
        )}
      </Flex>
      <EventList archive={true} />
    </>
  );
};

export default EventsArchivePage;
