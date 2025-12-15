import { Box, Button, Field, Input, VStack } from "@chakra-ui/react";
import { useCreate, useNavigation } from "@refinedev/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CreateUserRequest } from "../../features/users/users.requests";
import { useLayout } from "../../providers/layout-provider";

const UserCreatePage = () => {
  const { setTitle, setActions } = useLayout();
  const { list } = useNavigation();
  const { mutate: createUser } = useCreate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserRequest>();

  useEffect(() => {
    setTitle("Create User");
    setActions(null);
  }, [setTitle, setActions]);

  const onSubmit = (data: CreateUserRequest) => {
    createUser(
      {
        resource: "users",
        values: data,
      },
      {
        onSuccess: () => {
          list("roles");
        },
      },
    );
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4} align="stretch">
          <Field.Root invalid={!!errors.full_name}>
            <Field.Label>Full Name</Field.Label>
            <Input {...register("full_name", { required: true })} />
            {errors.full_name && (
              <Field.ErrorText>This field is required</Field.ErrorText>
            )}
          </Field.Root>

          <Button type="submit">Create User</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default UserCreatePage;
