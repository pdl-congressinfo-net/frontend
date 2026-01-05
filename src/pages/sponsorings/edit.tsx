import { Box, Button, Field, Input, VStack } from "@chakra-ui/react";
import { useNavigation, useOne, useUpdate } from "@refinedev/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import mapper from "../../features/companies/companies.mapper";
import { SponsoringDTO } from "../../features/companies/companies.responses";
import { useLayout } from "../../providers/layout-provider";

interface UpdateSponsoringRequest {
  name?: string;
  value?: number;
  employee_id?: string;
  contact_id?: string;
  event_id?: string;
}

const SponsoringEditPage = () => {
  const { setTitle, setActions } = useLayout();
  const { list } = useNavigation();
  const { id } = useParams<{ id: string }>();
  const { mutate: update } = useUpdate();
  const { query } = useOne<SponsoringDTO>({ resource: "sponsorings", id: id! });
  const { data, isLoading } = query;
  const sponsoring = data?.data ? mapper.sponsorings(data.data) : undefined;

  const { register, handleSubmit, reset } = useForm<UpdateSponsoringRequest>();

  useEffect(() => {
    setTitle("Edit Sponsoring");
    setActions(null);
  }, [setTitle, setActions]);

  useEffect(() => {
    if (sponsoring) {
      reset({
        name: sponsoring.name,
        value: sponsoring.value,
        employee_id: sponsoring.employeeId,
        contact_id: sponsoring.contactId,
        event_id: sponsoring.eventId,
      });
    }
  }, [sponsoring, reset]);

  const onSubmit = (values: UpdateSponsoringRequest) => {
    update(
      { resource: "sponsorings", id: id!, values },
      { onSuccess: () => list("sponsorings") },
    );
  };

  if (isLoading) return <Box>Loading...</Box>;

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4} align="stretch">
          <Field.Root>
            <Field.Label>Name</Field.Label>
            <Input {...register("name")} />
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

          <Button type="submit">Update</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default SponsoringEditPage;
