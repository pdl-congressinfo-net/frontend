import { Box, Button, Field, Input, Spinner, VStack } from "@chakra-ui/react";
import { useBack, useOne, useUpdate } from "@refinedev/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { EventType } from "../../../features/events/events.model";
import { UpdateEventTypeRequest } from "../../../features/events/events.requests";
import { useLayout } from "../../../providers/layout-provider";

const EventTypeEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const back = useBack();
  const { setTitle, setActions } = useLayout();
  const navigate = useNavigate();
  const { mutate: updateEventType } = useUpdate();

  const {
    result: data,
    query: { isLoading },
  } = useOne<EventType>({
    resource: "types",
    id: id!,
    meta: {
      parentModule: "events",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateEventTypeRequest>();

  useEffect(() => {
    setTitle("Edit Event Type");
    setActions(null);
  }, [setTitle, setActions]);

  useEffect(() => {
    if (data) {
      reset({
        code: data.code,
      });
    }
  }, [data, reset]);

  const onSubmit = (formData: UpdateEventTypeRequest) => {
    updateEventType(
      {
        resource: "types",
        id: id!,
        values: formData,
        meta: {
          parentModule: "events",
        },
      },
      {
        onSuccess: () => {
          back();
        },
      },
    );
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!id) {
    return <div>Event type not found</div>;
  }

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4} align="stretch">
          <Field.Root invalid={!!errors.code}>
            <Field.Label>Code (3 characters)</Field.Label>
            <Input
              {...register("code", {
                minLength: { value: 3, message: "Code must be 3 characters" },
                maxLength: { value: 3, message: "Code must be 3 characters" },
              })}
              placeholder="e.g., WRK"
            />
            {errors.code && (
              <Field.ErrorText>{errors.code.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Button type="submit">Update Event Type</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default EventTypeEditPage;
