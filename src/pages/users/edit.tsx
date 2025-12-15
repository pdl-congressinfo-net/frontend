import { Box, Button, Field, Input, VStack, HStack } from "@chakra-ui/react";
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
        email: user.email,
        contact: {
          titles: user.contact?.titles,
          first_name: user.contact?.firstName || "",
          last_name: user.contact?.lastName,
        },
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
          <HStack justifyContent="space-between">
            {result?.contact?.id && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => edit("contacts", result!.contact!.id!)}
              >
                Edit Linked Contact
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => (window.location.href = "/admin/contacts")}
            >
              View All Contacts
            </Button>
          </HStack>
          <Field.Root invalid={!!errors.email}>
            <Field.Label>Email</Field.Label>
            <Input type="email" {...register("email", { required: true })} />
            {errors.email && (
              <Field.ErrorText>This field is required</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root invalid={!!errors.contact?.titles}>
            <Field.Label>Titles (Optional)</Field.Label>
            <Input {...register("contact.titles")} />
          </Field.Root>

          <Field.Root invalid={!!errors.contact?.first_name}>
            <Field.Label>First Name</Field.Label>
            <Input {...register("contact.first_name", { required: true })} />
            {errors.contact?.first_name && (
              <Field.ErrorText>This field is required</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root invalid={!!errors.contact?.last_name}>
            <Field.Label>Last Name (Optional)</Field.Label>
            <Input {...register("contact.last_name")} />
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label>Password (Leave empty to keep current)</Field.Label>
            <Input type="password" {...register("password")} />
          </Field.Root>

          <Button type="submit">Update User</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default UserEditPage;
