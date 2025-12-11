import {
  Button,
  createListCollection,
  Field,
  Fieldset,
  Flex,
  Input,
  Portal,
  Select,
  Separator,
  Stack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useList, useTranslation } from "@refinedev/core";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApiResponse } from "../../../common/types/api";
import { Country, Location } from "../../../features/locations/location.model";
import { MapPicker } from "../../Common/Map";
import { SaveResult, StepStatus } from "./form-shared";
import { PhysicalLocationFormValues, WebinarLocationFormValues } from "./types";

type LocationProps = {
  onNext?: () => void;
  onPrevious?: () => void;
  onStatus?: (status: StepStatus) => void;
  onSave?: (
    data: PhysicalLocationFormValues | WebinarLocationFormValues,
  ) => Promise<SaveResult | void> | SaveResult | void;
  initialValues?:
    | Partial<PhysicalLocationFormValues>
    | Partial<WebinarLocationFormValues>;
  isWebinar?: boolean;
};

const createPhysicalSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z.string().min(1, t("common.validation.required")),
      road: z.string().optional(),
      number: z.string().optional(),
      postalCode: z.string().optional(),
      city: z.string().optional(),
      countryId: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.latitude == null || data.longitude == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["latitude"],
          message: t("locations.form.validation.locateOnMap"),
        });
      }
    });

const createWebinarSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("locations.form.validation.webinarNameRequired")),
    link: z.string().min(1, t("locations.form.validation.webinarLinkRequired")),
  });

const LocationPage = ({
  onNext,
  onPrevious,
  onStatus,
  onSave,
  initialValues,
  isWebinar = false,
}: LocationProps) => {
  const { translate: t } = useTranslation();
  const isWeb = isWebinar || (initialValues && "link" in initialValues);
  const schema = useMemo(
    () => (isWeb ? createWebinarSchema(t) : createPhysicalSchema(t)),
    [isWeb, t],
  );

  const { result: countries } = useList<Country>({
    resource: "countries",
    pagination: { pageSize: 1000 },
    sorters: [{ field: "name", order: "asc" }],
    meta: {
      parentmodule: "locations",
    },
  });

  const countryCollection = useMemo(
    () =>
      createListCollection<{ label: string; value: string }>({
        items: (Array.isArray(countries.data) ? countries.data : []).map(
          (c: Country) => ({
            label: c.name,
            value: c.id,
          }),
        ),
      }),
    [countries.data],
  );
  const defaultValues = useMemo(
    () => ({
      name: "",
      road: "",
      number: "",
      postalCode: "",
      city: "",
      latitude: undefined,
      longitude: undefined,
      countryId: "",
      link: "",
    }),
    [],
  );

  const { register, handleSubmit, setValue, watch, reset, trigger, formState } =
    useForm<PhysicalLocationFormValues | WebinarLocationFormValues>({
      mode: "onChange",
      resolver: zodResolver(schema) as any,
      defaultValues: defaultValues as any,
    });

  useEffect(() => {
    if (!initialValues) return;
    reset({
      ...defaultValues,
      ...initialValues,
    } as any);
    void trigger();
  }, [initialValues, reset, defaultValues, trigger]);

  const {
    errors,
    isValid,
    touchedFields,
    dirtyFields,
    isSubmitted,
    submitCount,
  } = formState as any;

  const name = watch("name");
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const road = watch("road");
  const number = watch("number");
  const postalCode = watch("postalCode");
  const city = watch("city");
  const selectedCountry = watch("countryId");
  const europeBounds = useMemo(() => L.latLngBounds([34, -25], [72, 45]), []);
  const defaultCenter = useMemo<[number, number]>(() => [54, 15], []);

  const onGeocode = async () => {
    const street = (road || "").trim();
    const house = (number || "").trim();
    const postal = (postalCode || "").trim();
    const cityTrimmed = (city || "").trim();
    const countryName = selectedCountry
      ? countries.data.find((c) => c.id === selectedCountry)?.name
      : "";
    const query = [street, house, postal, cityTrimmed, countryName]
      .filter(Boolean)
      .join(", ");
    if (!query) return;

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query,
      )}&limit=1`;

      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "LocationForm/1.0",
        },
      });

      const data = await res.json();
      if (Array.isArray(data) && data[0]) {
        const { lat, lon } = data[0];
        const nlat = parseFloat(lat);
        const nlng = parseFloat(lon);
        if (!isNaN(nlat) && !isNaN(nlng)) {
          setValue("latitude", nlat, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue("longitude", nlng, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
    } catch {
      // optionally handle error
    }
  };

  const onSubmit = handleSubmit(
    async (data: PhysicalLocationFormValues | WebinarLocationFormValues) => {
      try {
        await onSave?.(data);
        onNext?.();
      } catch (error) {
        console.error("Failed to persist location information", error);
      }
    },
  );

  function resolveCountryId(
    loc: any,
    countries: ApiResponse<Country[]>,
  ): Country | undefined {
    const byCode = countries.data.find((c) => c.code2 == loc.___countryCode);

    if (byCode) return byCode;

    return countries.data.find(
      (c) => c.name.toLowerCase() === loc.___countryName?.toLowerCase(),
    );
  }

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
            {t("locations.form.sections.location")}
          </Fieldset.Legend>
          <Fieldset.HelperText>
            {isWeb
              ? t("locations.form.sections.webinarHelp")
              : t("locations.form.sections.physicalHelp")}
          </Fieldset.HelperText>
        </Stack>
        {isWeb ? (
          <Fieldset.Content mt={4}>
            <Stack gap="2vh" align="flex-start">
              <Flex gap="1vw" wrap="wrap">
                <Field.Root invalid={!!errors?.name} width={"40vw"}>
                  <Field.Label>
                    {t("locations.form.fields.webinarName")}
                  </Field.Label>
                  <Input {...register("name")} />
                  <Field.ErrorText>
                    {(errors as any)?.name?.message as any}
                  </Field.ErrorText>
                </Field.Root>
                <Field.Root invalid={!!errors?.link} width={"40vw"}>
                  <Field.Label>
                    {t("locations.form.fields.webinarLink")}
                  </Field.Label>
                  <Input {...register("link")} />
                  <Field.ErrorText>
                    {(errors as any)?.link?.message as any}
                  </Field.ErrorText>
                </Field.Root>
              </Flex>
              <Flex gap="2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onPrevious?.()}
                >
                  {t("common.previous")}
                </Button>
                <Button type="submit" disabled={!isValid}>
                  {t("common.next")}
                </Button>
              </Flex>
            </Stack>
          </Fieldset.Content>
        ) : (
          <Fieldset.Content mt={4}>
            <Stack gap="2vh" align="flex-start">
              <Flex gap="1vw" wrap="wrap">
                <Field.Root invalid={!!errors?.name} width={"40vw"}>
                  <Field.Label>{t("locations.form.fields.name")}</Field.Label>
                  <Input {...register("name")} />
                  <Field.ErrorText>
                    {(errors as any)?.name?.message as any}
                  </Field.ErrorText>
                </Field.Root>
              </Flex>
              <Flex gap="1vw" wrap="wrap">
                <Field.Root invalid={!!errors?.road} width={"30vw"}>
                  <Field.Label>{t("locations.form.fields.street")}</Field.Label>
                  <Input {...register("road")} />
                  <Field.ErrorText>
                    {(errors as any)?.road?.message as any}
                  </Field.ErrorText>
                </Field.Root>
                <Field.Root invalid={!!errors?.number} width={"9vw"}>
                  <Field.Label>{t("locations.form.fields.number")}</Field.Label>
                  <Input {...register("number")} />
                  <Field.ErrorText>
                    {(errors as any)?.number?.message as any}
                  </Field.ErrorText>
                </Field.Root>
              </Flex>
              <Flex gap="1vw" wrap="wrap">
                <Field.Root invalid={!!errors?.postalCode} width={"7vw"}>
                  <Field.Label>
                    {t("locations.form.fields.postalCode")}
                  </Field.Label>
                  <Input {...register("postalCode")} />
                  <Field.ErrorText>
                    {(errors as any)?.postalCode?.message as any}
                  </Field.ErrorText>
                </Field.Root>
                <Field.Root invalid={!!errors?.city} width={"13vw"}>
                  <Field.Label>{t("locations.form.fields.city")}</Field.Label>
                  <Input {...register("city")} />
                  <Field.ErrorText>
                    {(errors as any)?.city?.message as any}
                  </Field.ErrorText>
                </Field.Root>
                {countryCollection && (
                  <Select.Root
                    collection={countryCollection}
                    size={"sm"}
                    width={"18vw"}
                    value={selectedCountry ? [selectedCountry] : []}
                    onValueChange={(e) => {
                      const nextId = Array.isArray(e.value)
                        ? e.value[0]
                        : e.value;
                      setValue("countryId", nextId ?? "", {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                    }}
                  >
                    <Select.HiddenSelect name="country" />
                    <Select.Label>
                      {t("locations.form.fields.country")}
                    </Select.Label>
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText
                          placeholder={t(
                            "locations.form.placeholders.selectCountry",
                          )}
                        />
                      </Select.Trigger>
                      <Select.Indicator />
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {countryCollection.items
                            .filter((item) => {
                              const country = countries.data.find(
                                (c) => c.id === item.value,
                              );
                              return country?.preferred;
                            })
                            .map((item) => (
                              <Select.Item key={item.value} item={item}>
                                {item.label}
                                <Select.ItemIndicator />
                              </Select.Item>
                            ))}
                          <Separator size={"lg"} />
                          {countryCollection.items
                            .filter((item) => {
                              const country = countries.data.find(
                                (c) => c.id === item.value,
                              );
                              return !country?.preferred;
                            })
                            .map((item) => (
                              <Select.Item key={item.value} item={item}>
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
              <Flex gap="2vh" align="center">
                <Button type="button" onClick={onGeocode}>
                  {t("locations.form.actions.findOnMap")}
                </Button>
              </Flex>
              <MapPicker
                location={
                  {
                    id: "",
                    name: (name || "").trim(),
                    road: (road || "").trim(),
                    number: (number || "").trim(),
                    postalCode: (postalCode || "").trim(),
                    city: (city || "").trim(),
                    latitude: latitude,
                    longitude: longitude,
                    countryId: selectedCountry,
                    locationTypeId: "",
                  } as unknown as Location
                }
                title={t("locations.form.actions.adjustLocation")}
                previewHeight={180}
                bounds={europeBounds}
                defaultCenter={defaultCenter}
                onSave={(loc: any) => {
                  const match = resolveCountryId(loc, countries);

                  if (match) {
                    setValue("countryId", match.id, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }

                  setValue("name", loc.name || "");
                  setValue("road", loc.road || "");
                  setValue("number", loc.number || "");
                  setValue("postalCode", loc.postalCode || "");
                  setValue("city", loc.city || "");

                  if (loc.latitude != null)
                    setValue("latitude", loc.latitude, { shouldDirty: true });
                  if (loc.longitude != null)
                    setValue("longitude", loc.longitude, { shouldDirty: true });
                }}
              />
              <Flex gap="2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onPrevious?.()}
                >
                  {t("common.previous")}
                </Button>
                <Button type="submit" disabled={!isValid}>
                  {t("common.next")}
                </Button>
              </Flex>
            </Stack>
          </Fieldset.Content>
        )}
      </Fieldset.Root>
    </form>
  );
};

export default LocationPage;
