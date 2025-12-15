import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useDelete, useOne } from "@refinedev/core";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { User } from "../../features/users/users.model";
import { useLayout } from "../../providers/layout-provider";

const UserShowPage = () => {
  const { setTitle, setActions } = useLayout();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mutate: deleteUser } = useDelete();

  const {
    result: userData,
    query: { isLoading },
  } = useOne<User>({
    resource: "users",
    id: id!,
  });

  useEffect(() => {
    setTitle("User Details");
    setActions(
      <Button
        colorScheme="red"
        onClick={() => {
          if (window.confirm("Are you sure you want to delete this user?")) {
            deleteUser(
              {
                resource: "users",
                id: id!,
              },
              {
                onSuccess: () => {
                  navigate("/users");
                },
              },
            );
          }
        }}
      >
        Delete Role
      </Button>,
    );
  }, [setTitle, setActions, id, deleteUser, navigate]);

  if (isLoading) return <Box>Loading...</Box>;
  if (!userData) return <Box>User not found</Box>;

  const user = userData;

  return (
    <Box p={4}>
      <VStack align="stretch" gap={4}>
        <Box>
          <Heading size="sm">ID</Heading>
          <Text>{user.id}</Text>
        </Box>

        <Box>
          <Heading size="sm">Name</Heading>
          <Text>{user.fullName}</Text>
        </Box>

        <Button onClick={() => navigate(`/users/edit/${id}`)}>Edit User</Button>
      </VStack>
    </Box>
  );
};

export default UserShowPage;
