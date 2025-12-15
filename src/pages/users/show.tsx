import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useDelete, useNavigation, useOne } from "@refinedev/core";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { User } from "../../features/users/users.model";
import { useLayout } from "../../providers/layout-provider";

const UserShowPage = () => {
  const { setTitle, setActions } = useLayout();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { edit } = useNavigation();
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
          <Heading size="sm">Email</Heading>
          <Text>{user.email}</Text>
        </Box>

        {user.titles && (
          <Box>
            <Heading size="sm">Titles</Heading>
            <Text>{user.titles}</Text>
          </Box>
        )}

        <Box>
          <Heading size="sm">First Name</Heading>
          <Text>{user.firstName}</Text>
        </Box>

        {user.lastName && (
          <Box>
            <Heading size="sm">Last Name</Heading>
            <Text>{user.lastName}</Text>
          </Box>
        )}

        {user.oeakId && (
          <Box>
            <Heading size="sm">OEAK ID</Heading>
            <Text>{user.oeakId}</Text>
          </Box>
        )}

        <Box>
          <Heading size="sm">Created At</Heading>
          <Text>{new Date(user.createdAt).toLocaleString()}</Text>
        </Box>

        <Box>
          <Heading size="sm">Last Login</Heading>
          <Text>
            {user.lastLogin
              ? new Date(user.lastLogin).toLocaleString()
              : "Never"}
          </Text>
        </Box>

        <Button onClick={() => edit("users", user.id!)}>Edit User</Button>
      </VStack>
    </Box>
  );
};

export default UserShowPage;
