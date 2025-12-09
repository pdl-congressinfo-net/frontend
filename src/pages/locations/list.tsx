import { useEffect } from "react";
import { useCan, useList } from "@refinedev/core";
import { Button, Box, Text } from "@chakra-ui/react";
import { LuCirclePlus } from "react-icons/lu";
import { Link } from "react-router";
import { useLayout } from "../../providers/layout-provider";

const LocationsListPage = () => {
  const { data: canAccess } = useCan({
    resource: "locations",
    action: "create",
  });
  const { setTitle, setActions } = useLayout();

  const { query: { data, isLoading } } = useList({
    resource: "locations",
  });

  useEffect(() => {
    setTitle("Locations");
    setActions(
      canAccess ? (
        <Link to="/locations/create">
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
      ) : null,
    );
  }, [canAccess, setActions, setTitle]);

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <Box>
      <Text fontSize="xl" mb={4}>Locations</Text>
      <Text>TODO: Implement Locations list component with table</Text>
      <Text>Total: {data?.total}</Text>
    </Box>
  );
};

export default LocationsListPage;
