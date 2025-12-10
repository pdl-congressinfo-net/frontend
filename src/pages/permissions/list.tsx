import { useEffect } from "react";
import { useLayout } from "../../providers/layout-provider";
import { useList, useNavigation } from "@refinedev/core";
import { Box, Button, Table } from "@chakra-ui/react";
import { Permission } from "../../features/permissions/permissions.model";

const PermissionsListActions = () => {
  const { create } = useNavigation();
  return (
    <Button onClick={() => create("permissions")}>Create Permission</Button>
  );
};

const PermissionsListPage = () => {
  const { setTitle, setActions } = useLayout();
  const { edit, show } = useNavigation();
  const {
    query: { isLoading },
    result,
  } = useList<Permission>({
    resource: "permissions",
  });

  useEffect(() => {
    setTitle("Permissions");
    setActions(<PermissionsListActions />);
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
          {result?.data?.map((permission) => (
            <Table.Row key={permission.id}>
              <Table.Cell>{permission.name}</Table.Cell>
              <Table.Cell>
                <Button
                  size="sm"
                  onClick={() => show("permissions", permission.id)}
                  mr={2}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  onClick={() => edit("permissions", permission.id)}
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

export default PermissionsListPage;
