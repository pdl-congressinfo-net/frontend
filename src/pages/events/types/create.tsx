import { Box, Button, Field, Input, VStack } from "@chakra-ui/react";
import { useCreate } from "@refinedev/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { CreateEventTypeRequest } from "../../../features/events/events.requests";
import { useLayout } from "../../../providers/layout-provider";

const EventTypeCreatePage = () => {
  const { setTitle, setActions } = useLayout();
  const navigate = useNavigate();
  const { mutate: createEventType } = useCreate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventTypeRequest>();

  useEffect(() => {
    setTitle("Create Event Type");
    setActions(null);
  }, [setTitle, setActions]);

  const onSubmit = (data: CreateEventTypeRequest) => {
    createEventType(
      {
        resource: "types",
        values: data,
        meta: {
          parentModule: "events",
        },
      },
      {
        onSuccess: () => {
          navigate("/events/types");
        },
      },
    );
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4} align="stretch">
          <Field.Root invalid={!!errors.code}>
            <Field.Label>Code (3 characters)</Field.Label>
            <Input
              {...register("code", {
                required: "Code is required",
                minLength: { value: 3, message: "Code must be 3 characters" },
                maxLength: { value: 3, message: "Code must be 3 characters" },
              })}
              placeholder="e.g., WRK"
            />
            {errors.code && (
              <Field.ErrorText>{errors.code.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Button type="submit">Create Event Type</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default EventTypeCreatePage;
