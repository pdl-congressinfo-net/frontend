import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useDelete, useOne } from "@refinedev/core";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Role } from "../../features/roles/roles.model";
import { useLayout } from "../../providers/layout-provider";

const RoleShowPage = () => {
  const { setTitle, setActions } = useLayout();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mutate: deleteRole } = useDelete();

  const {
    result: roleData,
    query: { isLoading },
  } = useOne<Role>({
    resource: "roles",
    id: id!,
  });

  useEffect(() => {
    setTitle("Role Details");
    setActions(
      <Button
        colorScheme="red"
        onClick={() => {
          if (window.confirm("Are you sure you want to delete this role?")) {
            deleteRole(
              {
                resource: "roles",
                id: id!,
              },
              {
                onSuccess: () => {
                  navigate("/roles");
                },
              },
            );
          }
        }}
      >
        Delete Role
      </Button>,
    );
  }, [setTitle, setActions, id, deleteRole, navigate]);

  if (isLoading) return <Box>Loading...</Box>;
  if (!roleData) return <Box>Role not found</Box>;

  const role = roleData;

  return (
    <Box p={4}>
      <VStack align="stretch" gap={4}>
        <Box>
          <Heading size="sm">ID</Heading>
          <Text>{role.id}</Text>
        </Box>

        <Box>
          <Heading size="sm">Name</Heading>
          <Text>{role.name}</Text>
        </Box>

        <Button onClick={() => navigate(`/roles/edit/${id}`)}>Edit Role</Button>
      </VStack>
    </Box>
  );
};

export default RoleShowPage;
