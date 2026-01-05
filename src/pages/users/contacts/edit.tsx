import { Box, Button, Field, Input, VStack } from "@chakra-ui/react";
import { useBack, useOne, useUpdate } from "@refinedev/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { Contact } from "../../../features/users/users.model";
import { UpdateContactRequest } from "../../../features/users/users.requests";

const ContactEditPage = () => {
  const back = useBack();
  const { id } = useParams<{ id: string }>();
  const { mutate: update } = useUpdate();
  const {
    query: { isLoading },
    result: data,
  } = useOne<Contact>({
    resource: "contacts",
    id: id!,
    meta: { parentModule: "users" },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateContactRequest>();

  useEffect(() => {
    if (data) {
      reset({
        email: data.email,
        titles: data.titles,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
      });
    }
  }, [isLoading, data, reset]);

  const onSubmit = (values: UpdateContactRequest) => {
    update(
      {
        resource: "contacts",
        id: id!,
        values,
        meta: { parentModule: "users" },
      },
      { onSuccess: () => back() },
    );
  };

  if (isLoading) return <Box>Loading...</Box>;

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4} align="stretch">
          <Field.Root invalid={!!errors.email}>
            <Field.Label>Email</Field.Label>
            <Input type="email" {...register("email")} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Titles</Field.Label>
            <Input {...register("titles")} />
          </Field.Root>

          <Field.Root>
            <Field.Label>First Name</Field.Label>
            <Input {...register("first_name")} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Last Name</Field.Label>
            <Input {...register("last_name")} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Phone Number</Field.Label>
            <Input {...register("phone_number")} />
          </Field.Root>

          <Button type="submit">Update</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ContactEditPage;
