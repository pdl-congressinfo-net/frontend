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
import { useInfiniteList, useList } from "@refinedev/core";
import { use, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EventCategory, EventType } from "../../../features/events/event.model";
import {
  mapEventCategory,
  mapEventType,
} from "../../../features/events/event.mapper";
import {
  EventCategoryDTO,
  EventTypeDTO,
} from "../../../features/events/event.responses";

interface BasicInformationValues {
  name: string;
  startDate: string; // yyyy-MM-dd
  oneDay: boolean;
  endDate?: string; // yyyy-MM-dd
  typeId: string;
  typeCode: string;
  field: string;
}

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
    startDate: z.preprocess(
      toYMD,
      z
        .string()
        .min(1, "Start date is required")
        .refine((s: string) => {
          // allow today or later; compare yyyy-MM-dd strings
          const now = new Date();
          const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
          return s >= today;
        }, "Start date cannot be in the past"),
    ),
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
  onSave?: (data: BasicInformationValues) => void;
};
type StepStatus = "done" | "error" | "open";

const BasicInformation = ({
  onNext,
  onPrevious,
  onStatus,
  onSave,
}: BasicInformationProps) => {
  const {
    watch,
    register,
    handleSubmit,
    setValue,
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
    defaultValues: {
      name: "",
      startDate: (() => {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`; // yyyy-MM-dd local
      })(),
      oneDay: false,
      endDate: undefined,
      field: "",
    },
    shouldUnregister: false,
  });

  // Derive collections from fetched arrays to avoid stale state

  const { result: eventCategoriesResult } = useList<EventCategoryDTO>({
    resource: "categories",
    sorters: [{ field: "nameDe", order: "asc" }],
    meta: {
      parentmodule: "events",
    },
  });

  const { result: eventTypesResult } = useList<EventTypeDTO>({
    resource: "types",
    sorters: [{ field: "nameDe", order: "asc" }],
    meta: {
      parentmodule: "events",
    },
  });

  // Some data providers return shape { data: [...] } while others return [...]
  const eventCategoriesDto =
    (eventCategoriesResult?.data as any)?.data ??
    eventCategoriesResult?.data ??
    [];
  const eventTypesDto =
    (eventTypesResult?.data as any)?.data ?? eventTypesResult?.data ?? [];

  const eventCategories: EventCategory[] = Array.isArray(eventCategoriesDto)
    ? (eventCategoriesDto as EventCategoryDTO[]).map(mapEventCategory)
    : [];
  const eventTypes: EventType[] = Array.isArray(eventTypesDto)
    ? (eventTypesDto as EventTypeDTO[]).map(mapEventType)
    : [];

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
  const selectedTypeCode = watch("typeCode");

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
      setValue("typeCode", nextDefault ? "CON" : "", {
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

  const onSubmit = handleSubmit((data) => {
    onSave?.(data);
    if (onNext) onNext();
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
  }, [isValid, isSubmitted, submitCount, touchedFields, dirtyFields]);

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
            <Field.Root invalid={!!errors.name} width={"30vw"}>
              <Field.Label>Event Name</Field.Label>
              <Input size="md" {...register("name")} />
              <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
            </Field.Root>
            <Flex gap="4">
              <Field.Root invalid={!!errors.startDate} width="15vw">
                <Field.Label>Start Date</Field.Label>
                <Input type="date" {...register("startDate")} />
                <Field.ErrorText>
                  {errors.startDate?.message || errors.oneDay?.message}
                </Field.ErrorText>
              </Field.Root>

              <Flex align="center" height="40px" mt="28px">
                <Checkbox.Root>
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

            <Field.Root invalid={!!errors.endDate} width={"15vw"}>
              <Field.Label>End Date</Field.Label>
              <Input type="date" disabled={oneDay} {...register("endDate")} />
              <Field.ErrorText>{errors.endDate?.message}</Field.ErrorText>
            </Field.Root>

            {eventCategoryCollection && (
              <Select.Root
                collection={eventCategoryCollection}
                size="sm"
                width="320px"
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
                width="320px"
                value={selectedType ? [selectedType] : []}
                onValueChange={(e) => {
                  const next = Array.isArray(e.value) ? e.value[0] : e.value;
                  setValue("typeId", next ?? "", {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  const selectedTypeObj = eventTypes.find((t) => t.id === next);
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
            <Flex gap="2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onPrevious && onPrevious()}
              >
                Previous
              </Button>
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
