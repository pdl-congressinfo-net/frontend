import { Box, Button, Field, Input, VStack } from "@chakra-ui/react";
import { useNavigation, useOne, useUpdate } from "@refinedev/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { User } from "../../features/users/users.model";
import { UpdateUserRequest } from "../../features/users/users.requests";
import { useLayout } from "../../providers/layout-provider";

const UserEditPage = () => {
  const { setTitle, setActions } = useLayout();
  const { list } = useNavigation();
  const { id } = useParams<{ id: string }>();
  const { mutate: updateUser } = useUpdate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserRequest>();

  const { query, result } = useOne<User>({
    resource: "users",
    id: id!,
  });
  const { data: response, isLoading } = query;

  useEffect(() => {
    const user = result ?? response?.data;
    if (user) {
      reset({
        full_name: user.fullName,
      });
    }
  }, [result, response, reset]);

  useEffect(() => {
    setTitle("Edit User");
    setActions(null);
  }, [setTitle, setActions]);

  const onSubmit = (data: UpdateUserRequest) => {
    updateUser(
      {
        resource: "users",
        id: id!,
        values: data,
      },
      {
        onSuccess: () => {
          list("users");
        },
      },
    );
  };

  if (isLoading) return <Box>Loading...</Box>;

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

          <Button type="submit">Update User</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default UserEditPage;
