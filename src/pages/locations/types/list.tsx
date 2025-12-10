import { useEffect } from "react";
import { useLayout } from "../../../providers/layout-provider";
import { useList } from "@refinedev/core";
import { Box, Table } from "@chakra-ui/react";
import { LocationType } from "../../../features/locations/location.model";

const LocationTypesListPage = () => {
  const { setTitle, setActions } = useLayout();
  const {
    result: data,
    query: { isLoading },
  } = useList<LocationType>({
    resource: "types",
    meta: { parentmodule: "locations" },
  });

  useEffect(() => {
    setTitle("Location Types");
    setActions(null);
  }, [setTitle, setActions]);

  if (isLoading) return <Box>Loading...</Box>;

  return (
    <Box p={4}>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.data.map((type) => (
            <Table.Row key={type.id}>
              <Table.Cell>{type.name}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default LocationTypesListPage;
