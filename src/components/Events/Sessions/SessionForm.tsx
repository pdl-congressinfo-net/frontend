import {
  Box,
  Button,
  createListCollection,
  Field,
  Fieldset,
  HStack,
  Input,
  Select,
  Stack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuCheck, LuX } from "react-icons/lu";
import { EventSession } from "../../../features/programm/programm.model";

interface SessionFormValues {
  name: string;
  date: string;
  start_time: string;
  end_time: string;
}

interface SessionFormProps {
  eventId: string;
  session?: EventSession;
  availableDates: string[];
  selectedDate?: string;
  onSave: (data: SessionFormValues & { event_id: string }) => void;
  onCancel: () => void;
  isInline?: boolean;
}

export const SessionForm = ({
  eventId,
  session,
  availableDates,
  selectedDate,
  onSave,
  onCancel,
  isInline = false,
}: SessionFormProps) => {
  const { t } = useTranslation();

  // Extract date and time from session if editing
  const defaultDate = session
    ? new Date(session.startTime).toISOString().split("T")[0]
    : selectedDate || availableDates[0] || "";
  const defaultStartTime = session
    ? new Date(session.startTime).toTimeString().slice(0, 5)
    : "";
  const defaultEndTime = session
    ? new Date(session.endTime).toTimeString().slice(0, 5)
    : "";

  const { register, handleSubmit } = useForm<SessionFormValues>({
    defaultValues: {
      name: session?.name || "",
      date: defaultDate,
      start_time: defaultStartTime,
      end_time: defaultEndTime,
    },
  });

  const dateCollection = createListCollection({
    items: availableDates.map((date) => ({
      label: new Date(date).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      value: date,
    })),
  });

  const onSubmit = (data: SessionFormValues) => {
    onSave({ ...data, event_id: eventId });
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      p={isInline ? 4 : 0}
      bg={isInline ? "blue.50" : "transparent"}
      borderRadius={isInline ? "md" : "none"}
    >
      <Fieldset.Root>
        <Stack gap={3}>
          <Field.Root required>
            <Field.Label>{t("events.programm.fields.sessionName")}</Field.Label>
            <Input
              placeholder={t("events.programm.placeholders.enterTitle")}
              {...register("name", { required: true })}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>Date</Field.Label>
            <Select.Root
              collection={dateCollection}
              defaultValue={[defaultDate]}
              positioning={{ sameWidth: true }}
            >
              <Select.Trigger>
                <Select.ValueText placeholder="Select date" />
              </Select.Trigger>
              <Select.Content>
                {dateCollection.items.map((item) => (
                  <Select.Item item={item} key={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
              <select
                {...register("date", { required: true })}
                hidden
                defaultValue={defaultDate}
              >
                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </Select.Root>
          </Field.Root>

          <HStack gap={3}>
            <Field.Root required flex={1}>
              <Field.Label>{t("events.programm.fields.startTime")}</Field.Label>
              <Input
                type="time"
                {...register("start_time", { required: true })}
              />
            </Field.Root>

            <Field.Root required flex={1}>
              <Field.Label>{t("events.programm.fields.endTime")}</Field.Label>
              <Input
                type="time"
                {...register("end_time", { required: true })}
              />
            </Field.Root>
          </HStack>

          <HStack justify="flex-end" gap={2}>
            <Button variant="ghost" onClick={onCancel}>
              <LuX /> {t("events.programm.actions.cancel")}
            </Button>
            <Button type="submit" colorPalette="blue">
              <LuCheck /> {t("events.programm.actions.save")}
            </Button>
          </HStack>
        </Stack>
      </Fieldset.Root>
    </Box>
  );
};
