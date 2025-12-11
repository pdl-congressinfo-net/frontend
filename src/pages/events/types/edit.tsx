import { Box, Button, Field, Input, Spinner, VStack } from "@chakra-ui/react";
import { useOne, useUpdate } from "@refinedev/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { EventType } from "../../../features/events/events.model";
import { UpdateEventTypeRequest } from "../../../features/events/events.requests";
import { useLayout } from "../../../providers/layout-provider";

const EventTypeEditPage = () => {
  const { id } = useParams<{ id: string }>();
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
      parentmodule: "events",
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
        name_de: data.nameDe,
        name_en: data.nameEn,
        description_de: data.descriptionDe,
        description_en: data.descriptionEn,
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
          parentmodule: "events",
        },
      },
      {
        onSuccess: () => {
          navigate("/events/types");
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

          <Field.Root invalid={!!errors.name_de}>
            <Field.Label>Name (German)</Field.Label>
            <Input {...register("name_de")} placeholder="e.g., Workshop" />
            {errors.name_de && (
              <Field.ErrorText>{errors.name_de.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root invalid={!!errors.name_en}>
            <Field.Label>Name (English)</Field.Label>
            <Input {...register("name_en")} placeholder="e.g., Workshop" />
            {errors.name_en && (
              <Field.ErrorText>{errors.name_en.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root invalid={!!errors.description_de}>
            <Field.Label>Description (German)</Field.Label>
            <Input
              {...register("description_de")}
              placeholder="Optional description in German"
            />
            {errors.description_de && (
              <Field.ErrorText>{errors.description_de.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root invalid={!!errors.description_en}>
            <Field.Label>Description (English)</Field.Label>
            <Input
              {...register("description_en")}
              placeholder="Optional description in English"
            />
            {errors.description_en && (
              <Field.ErrorText>{errors.description_en.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Button type="submit">Update Event Type</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default EventTypeEditPage;
