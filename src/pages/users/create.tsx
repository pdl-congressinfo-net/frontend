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
          <Field.Root invalid={!!errors.email}>
            <Field.Label>Email</Field.Label>
            <Input
              type="email"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <Field.ErrorText>This field is required</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root invalid={!!errors.titles}>
            <Field.Label>Titles (Optional)</Field.Label>
            <Input {...register("titles")} />
          </Field.Root>

          <Field.Root invalid={!!errors.first_name}>
            <Field.Label>First Name</Field.Label>
            <Input {...register("first_name", { required: true })} />
            {errors.first_name && (
              <Field.ErrorText>This field is required</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root invalid={!!errors.last_name}>
            <Field.Label>Last Name (Optional)</Field.Label>
            <Input {...register("last_name")} />
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label>Password</Field.Label>
            <Input
              type="password"
              {...register("password", { required: true })}
            />
            {errors.password && (
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
