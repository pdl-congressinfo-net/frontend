import { useEffect } from "react";
import { useCan, useList } from "@refinedev/core";
import { Button, Box, Text } from "@chakra-ui/react";
import { LuCirclePlus } from "react-icons/lu";
import { Link } from "react-router";
import { useLayout } from "../../../providers/layout-provider";

const CountriesListPage = () => {
  const { data: canAccess } = useCan({
    resource: "countries",
    action: "create",
  });
  const { setTitle, setActions } = useLayout();

  const { query: { data, isLoading } } = useList({
    resource: "countries",
  });

  useEffect(() => {
    setTitle("Countries");
    setActions(
      canAccess ? (
        <Link to="/locations/countries/create">
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
      <Text fontSize="xl" mb={4}>Countries</Text>
      <Text>TODO: Implement Countries list component with table</Text>
      <Text>Total: {data?.total}</Text>
    </Box>
  );
};

export default CountriesListPage;
