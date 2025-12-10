import {
  Button,
  Input,
  Field,
  Stack,
  Checkbox,
  Flex,
  Fieldset,
  Portal,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { useList } from "@refinedev/core";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  EventCategory,
  EventType,
} from "../../../features/events/events.model";
import {
  mapEventCategory,
  mapEventType,
} from "../../../features/events/events.mapper";
import {
  EventCategoryDTO,
  EventTypeDTO,
} from "../../../features/events/events.responses";
import {
  SaveResult,
  StepStatus,
  normalizeEventValues,
  isSameEventValues,
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

const BasicInformationSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    startDate: z.preprocess(toYMD, z.string().min(1, "Start date is required")),
    oneDay: z.preprocess((val) => {
      if (typeof val === "string") return val === "true" || val === "on";
      return Boolean(val);
    }, z.boolean().default(false)),
    endDate: z.preprocess((v) => {
      if (v === "" || v == null) return undefined;
      return toYMD(v);
    }, z.string().optional()),
    typeId: z.string().min(1, "Event type is required"),
    typeCode: z.string().min(1, "Event type code is required").default("CON"),
    field: z.string().default("MED"),
  })
  .superRefine((data, ctx) => {
    const start = data.startDate; // yyyy-MM-dd
    if (!data.oneDay) {
      if (!data.endDate) {
        ctx.addIssue({
          path: ["endDate"],
          message: "End date is required for multi-day events",
          code: z.ZodIssueCode.custom,
        });
      } else {
        const end = data.endDate; // yyyy-MM-dd
        if (end < start) {
          ctx.addIssue({
            path: ["endDate"],
            message: "End date must be after start date",
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
      typeId: "",
      typeCode: "CON",
      field: "",
    };
  }, []);

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
      typeId: initialValues.typeId ?? current.typeId,
      typeCode: initialValues.typeCode ?? current.typeCode,
      field: initialValues.field ?? current.field,
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

  const { result: eventCategories } = useList<EventCategoryDTO>({
    resource: "categories",
    sorters: [{ field: "nameDe", order: "asc" }],
    meta: {
      parentmodule: "events",
    },
  });

  const { result: eventTypes } = useList<EventTypeDTO>({
    resource: "types",
    sorters: [{ field: "nameDe", order: "asc" }],
    meta: {
      parentmodule: "events",
    },
  });

  const eventCategoryCollection = useMemo(
    () =>
      createListCollection<{ label: string; value: string }>({
        items: (Array.isArray(eventCategories) ? eventCategories : []).map(
          (c: EventCategory) => ({ label: c.nameDe, value: c.id }),
        ),
      }),
    [eventCategories],
  );

  const eventTypeCollection = useMemo(
    () =>
      createListCollection<{ label: string; value: string }>({
        items: (Array.isArray(eventTypes) ? eventTypes : []).map(
          (t: EventType) => ({ label: t.nameDe, value: t.id }),
        ),
      }),
    [eventTypes],
  );

  const oneDay = watch("oneDay");
  const startDate = watch("startDate");
  const selectedField = watch("field");
  const selectedType = watch("typeId");

  // Set default category by code 'MED' or first available
  useEffect(() => {
    const preferredCategoryCode = "MED";
    const preferredCategory = (eventCategories as EventCategory[]).find(
      (c) => c.code === preferredCategoryCode,
    );
    const fallbackCategory = (eventCategories as EventCategory[])[0];
    const nextDefault = preferredCategory?.id ?? fallbackCategory?.id;
    if (nextDefault && !selectedField) {
      setValue("field", nextDefault, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [eventCategories, selectedField, setValue]);

  // Set default type by code 'CON' or first available
  useEffect(() => {
    const preferredTypeCode = "CON";
    const preferredType = (eventTypes as EventType[]).find(
      (t) => t.code === preferredTypeCode,
    );
    const fallbackType = (eventTypes as EventType[])[0];
    const nextDefault = preferredType?.id ?? fallbackType?.id;
    if (nextDefault && !selectedType) {
      setValue("typeId", nextDefault, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      const nextCode = preferredType?.code ?? fallbackType?.code ?? "";
      setValue("typeCode", nextCode, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [eventTypes, selectedType, setValue]);

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
          <Fieldset.Legend>Basic Information</Fieldset.Legend>
          <Fieldset.HelperText>
            Provide the basic details of your event.
          </Fieldset.HelperText>
        </Stack>
        <Fieldset.Content mt={4}>
          <Stack gap="4" align="flex-start">
            <Field.Root invalid={!!errors.name} width={"40vw"}>
              <Field.Label>Event Name</Field.Label>
              <Input size="md" {...register("name")} />
              <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
            </Field.Root>
            <Flex gap="2vw">
              <Field.Root invalid={!!errors.startDate} width="19vw">
                <Field.Label>Start Date</Field.Label>
                <Input type="date" {...register("startDate")} />
                <Field.ErrorText>
                  {errors.startDate?.message || errors.oneDay?.message}
                </Field.ErrorText>
              </Field.Root>

              <Flex align="center" height="40px" mt="28px">
                <Checkbox.Root width="20vw">
                  <Checkbox.HiddenInput
                    {...register("oneDay")}
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      const checked = !!target.checked;
                      setValue("oneDay", checked, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                      if (checked) {
                        const sd = watch("startDate");
                        if (sd) {
                          setValue("endDate", sd, {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true,
                          });
                        }
                      }
                    }}
                  />
                  <Checkbox.Control />
                  <Checkbox.Label>One Day</Checkbox.Label>
                </Checkbox.Root>
              </Flex>
            </Flex>

            <Field.Root invalid={!!errors.endDate} width={"19vw"}>
              <Field.Label>End Date</Field.Label>
              <Input type="date" disabled={oneDay} {...register("endDate")} />
              <Field.ErrorText>{errors.endDate?.message}</Field.ErrorText>
            </Field.Root>
            <Flex gap="2vw" wrap={"wrap"} direction="row">
              {eventCategoryCollection && (
                <Select.Root
                  collection={eventCategoryCollection}
                  size="sm"
                  width="19vw"
                  value={selectedField ? [selectedField] : []}
                  onValueChange={(e) => {
                    const next = Array.isArray(e.value) ? e.value[0] : e.value;
                    setValue("field", next ?? "", {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                >
                  <Select.HiddenSelect name="field" />
                  <Select.Label>Select Category</Select.Label>
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select Category" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {eventCategoryCollection.items.map((item) => (
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
              {eventTypeCollection && (
                <Select.Root
                  collection={eventTypeCollection}
                  size="sm"
                  width="19vw"
                  value={selectedType ? [selectedType] : []}
                  onValueChange={(e) => {
                    const next = Array.isArray(e.value) ? e.value[0] : e.value;
                    setValue("typeId", next ?? "", {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                    const selectedTypeObj = eventTypes.find(
                      (t) => t.id === next,
                    );
                    setValue("typeCode", selectedTypeObj?.code ?? "", {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                >
                  <Select.HiddenSelect name="typeId" />
                  <Select.Label>Select Type</Select.Label>
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select Type" />
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
            </Flex>
            <Flex gap="2">
              <Button type="submit" disabled={!isValid}>
                Next
              </Button>
            </Flex>
          </Stack>
        </Fieldset.Content>
      </Fieldset.Root>
    </form>
  );
};

export default BasicInformation;
