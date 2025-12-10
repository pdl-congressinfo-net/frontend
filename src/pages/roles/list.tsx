import { useEffect } from "react";
import { useLayout } from "../../providers/layout-provider";
import { useList, useNavigation } from "@refinedev/core";
import { Box, Button, Table } from "@chakra-ui/react";
import { Role } from "../../features/roles/roles.model";

const RolesListActions = () => {
  const { create } = useNavigation();
  return <Button onClick={() => create("roles")}>Create Role</Button>;
};

const RolesListPage = () => {
  const { setTitle, setActions } = useLayout();
  const { edit, show } = useNavigation();
  const { query, result } = useList<Role>({
    resource: "roles",
  });
  const { isLoading } = query;

  useEffect(() => {
    setTitle("Roles");
    setActions(<RolesListActions />);
  }, [setTitle, setActions]);

  if (isLoading) return <Box>Loading...</Box>;

  return (
    <Box p={4}>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {result?.data?.map((role) => (
            <Table.Row key={role.id}>
              <Table.Cell>{role.name}</Table.Cell>
              <Table.Cell>
                <Button
                  size="sm"
                  onClick={() => show("roles", role.id)}
                  mr={2}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  onClick={() => edit("roles", role.id)}
                >
                  Edit
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default RolesListPage;
