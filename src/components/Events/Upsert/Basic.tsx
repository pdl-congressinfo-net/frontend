import {
  Button,
  Checkbox,
  Field,
  Fieldset,
  Flex,
  Input,
  Portal,
  Select,
  Stack,
  createListCollection,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useList, useTranslation } from "@refinedev/core";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EventType } from "../../../features/events/events.model";
import {
  SaveResult,
  StepStatus,
  isSameEventValues,
  normalizeEventValues,
} from "./form-shared";
import { BasicInformationValues } from "./types";
export type { BasicInformationValues } from "./types";

const toYMD = (v: unknown) => {
  if (v instanceof Date) {
    const y = v.getFullYear();
    const m = String(v.getMonth() + 1).padStart(2, "0");
    const d = String(v.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return v;
};

const createBasicInformationSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z.string().min(1, t("events.form.validation.nameRequired")),
      startDate: z.preprocess(
        toYMD,
        z.string().min(1, t("events.form.validation.startDateRequired")),
      ),
      oneDay: z.boolean().default(false),
      endDate: z.preprocess((v) => {
        if (v === "" || v == null) return undefined;
        return toYMD(v);
      }, z.string().optional()),
      eventTypeId: z.string().min(1, t("common.validation.required")),
      isPublic: z.boolean().default(false),
    })
    .superRefine((data, ctx) => {
      const start = data.startDate;
      if (!data.oneDay) {
        if (!data.endDate) {
          ctx.addIssue({
            path: ["endDate"],
            message: t("events.form.validation.endDateRequired"),
            code: z.ZodIssueCode.custom,
          });
        } else {
          const end = data.endDate;
          if (end < start) {
            ctx.addIssue({
              path: ["endDate"],
              message: t("events.form.validation.endDateAfterStart"),
              code: z.ZodIssueCode.custom,
            });
          }
        }
      }
    });

type BasicInformationProps = {
  onNext?: () => void;
  onPrevious?: () => void;
  onStatus?: (status: StepStatus) => void;
  onSave?: (
    data: BasicInformationValues,
  ) => Promise<SaveResult | void> | SaveResult | void;
  initialValues?: Partial<BasicInformationValues>;
  onChange?: (
    data: BasicInformationValues,
    meta?: { source: "user" | "sync" },
  ) => void;
};

const BasicInformation = ({
  onNext,
  onStatus,
  onSave,
  initialValues,
  onChange,
}: BasicInformationProps) => {
  const { translate: t } = useTranslation();
  const syncingRef = useRef(false);
  const defaultValues = useMemo<BasicInformationValues>(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return {
      name: "",
      startDate: `${y}-${m}-${day}`,
      oneDay: false,
      endDate: undefined,
      eventTypeId: "",
      isPublic: false,
    };
  }, []);

  const BasicInformationSchema = useMemo(
    () => createBasicInformationSchema(t),
    [t],
  );

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    trigger,
    formState: {
      errors,
      isValid,
      touchedFields,
      dirtyFields,
      isSubmitted,
      submitCount,
    },
  } = useForm<BasicInformationValues>({
    mode: "onChange",
    resolver: zodResolver(BasicInformationSchema) as any,
    defaultValues,
    shouldUnregister: false,
  });

  useEffect(() => {
    if (!initialValues) return;
    const current = getValues();
    const next: BasicInformationValues = {
      ...current,
      ...initialValues,
      startDate: initialValues.startDate ?? current.startDate,
      oneDay: initialValues.oneDay ?? current.oneDay,
      endDate:
        (initialValues.oneDay ?? current.oneDay)
          ? (initialValues.startDate ?? current.startDate)
          : (initialValues.endDate ?? current.endDate),
      eventTypeId: initialValues.eventTypeId ?? current.eventTypeId,
      isPublic: initialValues.isPublic ?? current.isPublic,
    };

    const normalizedCurrent = normalizeEventValues(
      current as BasicInformationValues,
    );
    const normalizedNext = normalizeEventValues(next);
    if (isSameEventValues(normalizedCurrent, normalizedNext)) {
      return;
    }
    syncingRef.current = true;
    reset(next);
    void trigger().finally(() => {
      syncingRef.current = false;
    });
  }, [initialValues, getValues, reset, trigger]);

  // Derive collections from fetched arrays to avoid stale state

  const { result: eventTypes } = useList<EventType>({
    resource: "types",
    sorters: [{ field: "nameDe", order: "asc" }],
    meta: {
      parentmodule: "events",
    },
  });

  const eventTypeCollection = useMemo(
    () =>
      createListCollection<{ label: string; value: string }>({
        items: (Array.isArray(eventTypes.data) ? eventTypes.data : []).map(
          (t: EventType) => ({ label: t.nameDe, value: t.id }),
        ),
      }),
    [eventTypes.data],
  );

  const oneDay = watch("oneDay");
  const startDate = watch("startDate");
  const selectedEventType = watch("eventTypeId");

  useEffect(() => {
    if (oneDay && startDate) {
      setValue("endDate", startDate, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [oneDay, startDate, setValue]);

  useEffect(() => {
    if (!onChange) return;
    const subscription = watch((value) => {
      const normalized = normalizeEventValues(value as BasicInformationValues);
      const source = syncingRef.current ? "sync" : "user";
      onChange(normalized, { source });
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await onSave?.(data);
      onNext?.();
    } catch (error) {
      console.error("Failed to persist basic information", error);
    }
  });

  useEffect(() => {
    const hasInteracted =
      isSubmitted ||
      submitCount > 0 ||
      Object.keys(touchedFields ?? {}).length > 0 ||
      Object.keys(dirtyFields ?? {}).length > 0;
    const status: StepStatus = isValid
      ? "done"
      : hasInteracted
        ? "error"
        : "open";
    onStatus?.(status);
  }, [isValid, isSubmitted, submitCount, touchedFields, dirtyFields, onStatus]);

  return (
    <form onSubmit={onSubmit}>
      <Fieldset.Root size="lg">
        <Stack>
          <Fieldset.Legend>
            {t("events.form.sections.basicInformation")}
          </Fieldset.Legend>
          <Fieldset.HelperText>
            {t("events.form.sections.basicInformationHelp")}
          </Fieldset.HelperText>
        </Stack>
        <Fieldset.Content mt={4}>
          <Stack gap="4" align="flex-start">
            <Field.Root invalid={!!errors.name} width={"40vw"}>
              <Field.Label>{t("events.form.fields.eventName")}</Field.Label>
              <Input size="md" {...register("name")} />
              <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
            </Field.Root>
            <Flex gap="2vw">
              <Field.Root invalid={!!errors.startDate} width="19vw">
                <Field.Label>{t("events.form.fields.startDate")}</Field.Label>
                <Input type="date" {...register("startDate")} />
                <Field.ErrorText>
                  {errors.startDate?.message || errors.oneDay?.message}
                </Field.ErrorText>
              </Field.Root>

              <Flex align="center" height="40px" mt="28px">
                <Checkbox.Root width="20vw" checked={oneDay}>
                  <Checkbox.HiddenInput
                    name="oneDay"
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      const checked = !!target.checked;
                      const currentStartDate = watch("startDate");

                      setValue("oneDay", checked, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      });

                      if (checked && currentStartDate) {
                        // When checking, set endDate to same as startDate
                        setValue("endDate", currentStartDate, {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                      }
                    }}
                  />
                  <Checkbox.Control />
                  <Checkbox.Label>
                    {t("events.form.fields.oneDay")}
                  </Checkbox.Label>
                </Checkbox.Root>
              </Flex>
            </Flex>

            <Field.Root invalid={!!errors.endDate} width={"19vw"}>
              <Field.Label>{t("events.form.fields.endDate")}</Field.Label>
              <Input type="date" disabled={oneDay} {...register("endDate")} />
              <Field.ErrorText>{errors.endDate?.message}</Field.ErrorText>
            </Field.Root>
            {eventTypeCollection && (
              <Select.Root
                collection={eventTypeCollection}
                size="sm"
                width="19vw"
                value={selectedEventType ? [selectedEventType] : []}
                onValueChange={(e) => {
                  const next = Array.isArray(e.value) ? e.value[0] : e.value;
                  setValue("eventTypeId", next ?? "", {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }}
              >
                <Select.HiddenSelect name="eventTypeId" />
                <Select.Label>{t("events.form.fields.eventType")}</Select.Label>
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText
                      placeholder={t(
                        "events.form.placeholders.selectEventType",
                      )}
                    />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {eventTypeCollection.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            )}
            <Flex gap="2">
              <Button type="submit" disabled={!isValid}>
                {t("common.next")}
              </Button>
            </Flex>
          </Stack>
        </Fieldset.Content>
      </Fieldset.Root>
    </form>
  );
};

export default BasicInformation;
