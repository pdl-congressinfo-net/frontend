import { Box, Button, Table } from "@chakra-ui/react";
import { useList, useNavigation } from "@refinedev/core";
import { useEffect } from "react";
import mapper from "../../features/companies/companies.mapper";
import { SponsoringDTO } from "../../features/companies/companies.responses";
import { useLayout } from "../../providers/layout-provider";

const SponsoringsListPage = () => {
  const { setTitle, setActions } = useLayout();
  const { show } = useNavigation();
  const { query } = useList<SponsoringDTO>({ resource: "sponsorings" });
  const { data, isLoading } = query;
  const items = (data?.data ?? []).map(mapper.sponsorings);

  useEffect(() => {
    setTitle("Sponsorings");
    setActions(
      <Button
        onClick={() => (window.location.href = "/admin/sponsorings/create")}
      >
        Create Sponsoring
      </Button>,
    );
    return () => setActions(null);
  }, [setTitle, setActions]);

  if (isLoading) return <Box>Loading...</Box>;

  return (
    <Box p={4}>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Value</Table.ColumnHeader>
            <Table.ColumnHeader>Employee/Contact</Table.ColumnHeader>
            <Table.ColumnHeader>Event</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((s) => (
            <Table.Row key={s.id}>
              <Table.Cell>{s.name}</Table.Cell>
              <Table.Cell>{s.value}</Table.Cell>
              <Table.Cell>{s.employeeId ?? s.contactId ?? "-"}</Table.Cell>
              <Table.Cell>{s.eventId ?? "-"}</Table.Cell>
              <Table.Cell>
                <Button size="sm" onClick={() => show("sponsorings", s.id)}>
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

export default SponsoringsListPage;
