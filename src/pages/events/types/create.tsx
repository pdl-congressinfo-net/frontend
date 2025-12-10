import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useCreate } from "@refinedev/core";
import { useLayout } from "../../../providers/layout-provider";
import { Box, Button, VStack, Input, Field } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { CreateEventTypeRequest } from "../../../features/events/events.requests";

const EventTypeCreatePage = () => {
  const { setTitle, setActions } = useLayout();
  const navigate = useNavigate();
  const { mutate: createEventType } = useCreate();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateEventTypeRequest>();

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
          parentmodule: "events",
        },
      },
      {
        onSuccess: () => {
          navigate("/events/types");
        },
      }
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
            {errors.code && <Field.ErrorText>{errors.code.message}</Field.ErrorText>}
          </Field.Root>

          <Field.Root invalid={!!errors.name_de}>
            <Field.Label>Name (German)</Field.Label>
            <Input
              {...register("name_de", { required: "German name is required" })}
              placeholder="e.g., Workshop"
            />
            {errors.name_de && <Field.ErrorText>{errors.name_de.message}</Field.ErrorText>}
          </Field.Root>

          <Field.Root invalid={!!errors.name_en}>
            <Field.Label>Name (English)</Field.Label>
            <Input
              {...register("name_en", { required: "English name is required" })}
              placeholder="e.g., Workshop"
            />
            {errors.name_en && <Field.ErrorText>{errors.name_en.message}</Field.ErrorText>}
          </Field.Root>

          <Field.Root invalid={!!errors.description_de}>
            <Field.Label>Description (German)</Field.Label>
            <Input
              {...register("description_de")}
              placeholder="Optional description in German"
            />
            {errors.description_de && <Field.ErrorText>{errors.description_de.message}</Field.ErrorText>}
          </Field.Root>

          <Field.Root invalid={!!errors.description_en}>
            <Field.Label>Description (English)</Field.Label>
            <Input
              {...register("description_en")}
              placeholder="Optional description in English"
            />
            {errors.description_en && <Field.ErrorText>{errors.description_en.message}</Field.ErrorText>}
          </Field.Root>

          <Button type="submit">Create Event Type</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default EventTypeCreatePage;
