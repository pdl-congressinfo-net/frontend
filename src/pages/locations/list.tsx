import { useEffect } from "react";
import { useLayout } from "../../providers/layout-provider";
import { useList, useNavigation } from "@refinedev/core";
import { Box, Button, Table } from "@chakra-ui/react";
import { Location } from "../../features/locations/location.model";

const LocationsListPage = () => {
  const { setTitle, setActions } = useLayout();
  const { create } = useNavigation();
  const { result: data, isLoading } = useList<Location>({
    resource: "locations",
  });

  useEffect(() => {
    setTitle("Locations");
    setActions(
      <Button onClick={() => create("locations")}>Create Location</Button>
    );
  }, [setTitle, setActions, create]);

  if (isLoading) return <Box>Loading...</Box>;

  return (
    <Box p={4}>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>City</Table.ColumnHeader>
            <Table.ColumnHeader>State</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.data.map((location) => (
            <Table.Row key={location.id}>
              <Table.Cell>{location.name}</Table.Cell>
              <Table.Cell>{location.city}</Table.Cell>
              <Table.Cell>{location.state}</Table.Cell>
              <Table.Cell>
                <Button
                  size="sm"
                  onClick={() => window.location.href = `/locations/show/${location.id}`}
                >
                  View
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default LocationsListPage;
