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
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuCheck, LuX } from "react-icons/lu";
import {
  Programm,
  ProgrammType,
} from "../../../features/programm/programm.model";

interface ProgrammFormValues {
  title: string;
  description?: string;
  type: ProgrammType;
  start_time: string;
  end_time: string;
}

interface ProgrammFormProps {
  sessionId: string;
  programm?: Programm;
  onSave: (data: ProgrammFormValues & { session_id: string }) => void;
  onCancel: () => void;
  isInline?: boolean;
}

export const ProgrammForm = ({
  sessionId,
  programm,
  onSave,
  onCancel,
  isInline = false,
}: ProgrammFormProps) => {
  const { t } = useTranslation();

  // Extract time from programm if editing
  const defaultStartTime = programm
    ? new Date(programm.startTime).toTimeString().slice(0, 5)
    : "";
  const defaultEndTime = programm
    ? new Date(programm.endTime).toTimeString().slice(0, 5)
    : "";

  const { register, handleSubmit } = useForm<ProgrammFormValues>({
    defaultValues: {
      title: programm?.title || "",
      description: programm?.description || "",
      type: programm?.type || "LCT",
      start_time: defaultStartTime,
      end_time: defaultEndTime,
    },
  });

  const programmTypes: ProgrammType[] = [
    "LCT",
    "WKS",
    "DMO",
    "NET",
    "BRK",
    "KEY",
    "OTH",
  ];
  const typeCollection = createListCollection({
    items: programmTypes.map((type) => ({
      label: t(`events.programm.types.${type}`),
      value: type,
    })),
  });

  const onSubmit = (data: ProgrammFormValues) => {
    onSave({ ...data, session_id: sessionId });
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      p={isInline ? 4 : 0}
      bg={isInline ? "gray.50" : "transparent"}
      borderRadius={isInline ? "md" : "none"}
    >
      <Fieldset.Root>
        <Stack gap={3}>
          <Field.Root required>
            <Field.Label>{t("events.programm.fields.title")}</Field.Label>
            <Input
              placeholder={t("events.programm.placeholders.enterTitle")}
              {...register("title", { required: true })}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>{t("events.programm.fields.description")}</Field.Label>
            <Textarea
              placeholder={t("events.programm.placeholders.enterDescription")}
              {...register("description")}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>{t("events.programm.fields.type")}</Field.Label>
            <Select.Root
              collection={typeCollection}
              defaultValue={[programm?.type || "LCT"]}
              positioning={{ sameWidth: true }}
            >
              <Select.Trigger>
                <Select.ValueText
                  placeholder={t("events.programm.placeholders.selectType")}
                />
              </Select.Trigger>
              <Select.Content>
                {typeCollection.items.map((item) => (
                  <Select.Item item={item} key={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
              <select {...register("type", { required: true })} hidden>
                {programmTypes.map((type) => (
                  <option key={type} value={type}>
                    {t(`events.programm.types.${type}`)}
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
