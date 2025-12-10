import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useOne, useDelete } from "@refinedev/core";
import { useLayout } from "../../providers/layout-provider";
import { Box, Button, VStack, Heading, Text } from "@chakra-ui/react";
import { Permission } from "../../features/permissions/permissions.model";

const PermissionShowPage = () => {
  const { setTitle, setActions } = useLayout();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mutate: deletePermission } = useDelete();

  const {
    result: permissionData,
    query: { isLoading },
  } = useOne<Permission>({
    resource: "permissions",
    id: id!,
  });

  useEffect(() => {
    setTitle("Permission Details");
    setActions(
      <Button
        colorScheme="red"
        onClick={() => {
          if (
            window.confirm("Are you sure you want to delete this permission?")
          ) {
            deletePermission(
              {
                resource: "permissions",
                id: id!,
              },
              {
                onSuccess: () => {
                  navigate("/permissions");
                },
              },
            );
          }
        }}
      >
        Delete Permission
      </Button>,
    );
  }, [setTitle, setActions, id, deletePermission, navigate]);

  if (isLoading) return <Box>Loading...</Box>;
  if (!permissionData) return <Box>Permission not found</Box>;

  const permission = permissionData;

  return (
    <Box p={4}>
      <VStack align="stretch" gap={4}>
        <Box>
          <Heading size="sm">ID</Heading>
          <Text>{permission.id}</Text>
        </Box>

        <Box>
          <Heading size="sm">Name</Heading>
          <Text>{permission.name}</Text>
        </Box>

        <Button onClick={() => navigate(`/permissions/edit/${id}`)}>
          Edit Permission
        </Button>
      </VStack>
    </Box>
  );
};

export default PermissionShowPage;
