import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Image,
  Input,
  Separator,
} from "@chakra-ui/react";
import { CanAccess, useCreate } from "@refinedev/core";

const AdminTempInterface = {};

export const AdminTemp = ({}: typeof AdminTempInterface) => {
  const { mutateAsync: createPermission, mutation: createPermissionMutation } =
    useCreate();

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get("name") as string;
    createPermission({
      resource: "permissions",
      values: {
        name: name,
      },
    });
  };

  return (
    <Card.Root
      size="md"
      borderWidth="1px"
      borderRadius="md"
      dropShadow="md"
      _hover={{ dropShadow: "lg" }}
    >
      <Flex
        direction="column"
        justifyContent="space-between"
        gap={4}
        padding={4}
      >
        <Heading size="md">Admin Area</Heading>
        <Heading size="sm">Permissions</Heading>
        <Separator />
        <CanAccess resource="permissions" action="create">
          <form onSubmit={submitHandler}>
            <Input name="name" placeholder="Create Permission" mb={2} />
            <Button type="submit" mb={4}>
              Create
            </Button>
          </form>
          {createPermissionMutation.isLoading && <div>Creating...</div>}
          {createPermissionMutation.isError && (
            <div>Error: {createPermissionMutation.error.message}</div>
          )}
          {createPermissionMutation.isSuccess && (
            <div>Permission created successfully!</div>
          )}
        </CanAccess>
      </Flex>
    </Card.Root>
  );
};
