import { Box, Button, Field, Input, VStack } from "@chakra-ui/react";
import { useCreate, useNavigation } from "@refinedev/core";
import { useForm } from "react-hook-form";

interface CreateContactRequest {
  email: string;
  titles?: string;
  first_name: string;
  last_name?: string;
  phone_number?: string;
}

const ContactCreatePage = () => {
  const { list } = useNavigation();
  const { mutate: create } = useCreate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateContactRequest>();

  const onSubmit = (values: CreateContactRequest) => {
    create(
      { resource: "contacts", values, meta: { parentModule: "users" } },
      { onSuccess: () => list("contacts") },
    );
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4} align="stretch">
          <Field.Root invalid={!!errors.email}>
            <Field.Label>Email</Field.Label>
            <Input type="email" {...register("email", { required: true })} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Titles</Field.Label>
            <Input {...register("titles")} />
          </Field.Root>

          <Field.Root invalid={!!errors.first_name}>
            <Field.Label>First Name</Field.Label>
            <Input {...register("first_name", { required: true })} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Last Name</Field.Label>
            <Input {...register("last_name")} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Phone Number</Field.Label>
            <Input {...register("phone_number")} />
          </Field.Root>

          <Button type="submit">Create</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ContactCreatePage;
