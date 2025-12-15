import { Box, Button, Field, Input, VStack } from "@chakra-ui/react";
import { useCreate, useNavigation } from "@refinedev/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLayout } from "../../providers/layout-provider";

interface CreateSponsoringRequest {
  name: string;
  value?: number;
  employee_id?: string;
  contact_id?: string;
  event_id?: string;
}

const SponsoringCreatePage = () => {
  const { setTitle, setActions } = useLayout();
  const { list } = useNavigation();
  const { mutate: create } = useCreate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSponsoringRequest>();

  useEffect(() => {
    setTitle("Create Sponsoring");
    setActions(null);
  }, [setTitle, setActions]);

  const onSubmit = (values: CreateSponsoringRequest) => {
    create(
      { resource: "sponsorings", values },
      { onSuccess: () => list("sponsorings") },
    );
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4} align="stretch">
          <Field.Root invalid={!!errors.name}>
            <Field.Label>Name</Field.Label>
            <Input {...register("name", { required: true })} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Value</Field.Label>
            <Input type="number" step="0.01" {...register("value")} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Employee ID</Field.Label>
            <Input {...register("employee_id")} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Contact ID</Field.Label>
            <Input {...register("contact_id")} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Event ID</Field.Label>
            <Input {...register("event_id")} />
          </Field.Root>

          <Button type="submit">Create</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default SponsoringCreatePage;
