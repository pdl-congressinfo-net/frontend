import { Box, Table } from "@chakra-ui/react";
import { useList } from "@refinedev/core";
import { useEffect } from "react";
import { Country } from "../../../features/locations/location.model";
import { useLayout } from "../../../providers/layout-provider";

const CountriesListPage = () => {
  const { setTitle, setActions } = useLayout();
  const {
    result: data,
    query: { isLoading },
  } = useList<Country>({
    resource: "countries",
    meta: { parentmodule: "locations" },
    filters: [{ field: "preferred", operator: "eq", value: true }],
  });

  useEffect(() => {
    setTitle("Countries");
    setActions(null);
  }, [setTitle, setActions]);

  if (isLoading) return <Box>Loading...</Box>;

  return (
    <Box p={4}>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Code 2</Table.ColumnHeader>
            <Table.ColumnHeader>Code 3</Table.ColumnHeader>
            <Table.ColumnHeader>DevCo</Table.ColumnHeader>
            <Table.ColumnHeader>Preferred</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.data.map((country) => (
            <Table.Row key={country.id}>
              <Table.Cell>{country.name}</Table.Cell>
              <Table.Cell>{country.code2}</Table.Cell>
              <Table.Cell>{country.code3}</Table.Cell>
              <Table.Cell>{country.devco ? "Yes" : "No"}</Table.Cell>
              <Table.Cell>{country.preferred ? "Yes" : "No"}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default CountriesListPage;
