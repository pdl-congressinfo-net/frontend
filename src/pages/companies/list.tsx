import { useEffect } from "react";
import { useLayout } from "../../providers/layout-provider";
import { useList, useNavigation } from "@refinedev/core";
import { Box, Button, Table } from "@chakra-ui/react";
import { Company } from "../../features/companies/companies.model";

const CompaniesListPage = () => {
  const { setTitle, setActions } = useLayout();
  const { create } = useNavigation();
  const {
    result: data,
    query: { isLoading },
  } = useList<Company>({
    resource: "companies",
  });

  useEffect(() => {
    setTitle("Companies");
    setActions(
      <Button onClick={() => create("companies")}>Create Company</Button>,
    );
  }, [setTitle, setActions, create]);

  if (isLoading) return <Box>Loading...</Box>;

  return (
    <Box p={4}>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Sponsoring</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.data.map((company) => (
            <Table.Row key={company.id}>
              <Table.Cell>{company.name}</Table.Cell>
              <Table.Cell>{company.sponsoring ? "Yes" : "No"}</Table.Cell>
              <Table.Cell>
                <Button
                  size="sm"
                  onClick={() =>
                    (window.location.href = `/companies/show/${company.id}`)
                  }
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

export default CompaniesListPage;
