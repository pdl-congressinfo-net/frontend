import {
  Box,
  Button,
  Input,
  Field,
  Stack,
  Flex,
  Fieldset,
  createListCollection,
  Select,
  Portal,
  Splitter,
  Separator,
} from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { string, z } from "zod";
import L from "leaflet";
import { MapPicker } from "../../Common/Map";
import { Country, Location } from "../../../features/locations/location.model";
import { useList } from "@refinedev/core";
import { CountryDTO } from "../../../features/locations/location.responses";
import { mapCountry } from "../../../features/locations/location.mapper";
import { count } from "console";

type PhysicalLocationFormValues = {
  name: string;
  road: string;
  number: string;
  postalCode: string;
  city: string;
  lat: number;
  lng: number;
  country: string;
  countryId: string;
};

type StepStatus = "done" | "error" | "open";

type LocationProps = {
  onNext?: () => void;
  onPrevious?: () => void;
  onStatus?: (status: StepStatus) => void;
  eventTypeCode?: string | null;
};

const physicalSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    road: z.string().min(1, "Street is required"),
    number: z.number().min(1, "Number is required").or(z.string().min(1)),
    postalCode: z
      .number()
      .min(1, "Postal code is required")
      .or(z.string().min(1)),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    countryId: z.string().min(1, "CountryId is required"),
    lat: z.number().optional(),
    lng: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.lat == null || data.lng == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["lat"],
        message: "Please locate the address on the map",
      });
    }
  });

const LocationPage = ({
  onNext,
  onPrevious,
  onStatus,
  eventTypeCode,
}: LocationProps) => {
  const isWeb = eventTypeCode === "WEB";
  const schema = useMemo(() => physicalSchema, [isWeb]);

  const { result: locationsCountriesResult } = useList<CountryDTO>({
    resource: "countries",
    pagination: { pageSize: 1000 },
    sorters: [{ field: "name", order: "asc" }],
    meta: {
      parentmodule: "locations",
    },
  });

  const countriesDto =
    (locationsCountriesResult?.data as any)?.data ??
    locationsCountriesResult?.data ??
    [];

  const countries: Country[] = Array.isArray(countriesDto)
    ? (countriesDto as CountryDTO[]).map(mapCountry)
    : [];

  const countryCollection = useMemo(
    () =>
      createListCollection<{ label: string; value: string }>({
        items: (Array.isArray(countries) ? countries : []).map(
          (c: Country) => ({
            label: c.name,
            value: c.id,
          }),
        ),
      }),
    [countries],
  );
  const { register, handleSubmit, setValue, watch, formState } =
    useForm<PhysicalLocationFormValues>({
      mode: "onChange",
      resolver: zodResolver(schema) as any,
      defaultValues: {
        name: "",
        road: "",
        number: "",
        postalCode: "",
        city: "",
        lat: undefined,
        lng: undefined,
        country: "",
        countryId: "",
      },
    });

  const {
    errors,
    isValid,
    touchedFields,
    dirtyFields,
    isSubmitted,
    submitCount,
  } = formState as any;
  const name = watch("name");
  const lat = watch("lat");
  const lng = watch("lng");
  const road = watch("road");
  const number = watch("number");
  const postalCode = watch("postalCode");
  const city = watch("city");
  const selectedCountry = watch("countryId");
  const country = watch("country");
  const europeBounds = useMemo(() => L.latLngBounds([34, -25], [72, 45]), []);
  const defaultCenter = useMemo<[number, number]>(() => [54, 15], []);

  const onGeocode = async () => {
    const street = (road || "").trim();
    const house = (number || "").trim();
    const postal = (postalCode || "").trim();
    const cityTrimmed = (city || "").trim();
    const countryTrimmed = (country || "").trim();
    const query = [street, house, postal, cityTrimmed, countryTrimmed]
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
          setValue("lat", nlat, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue("lng", nlng, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
    } catch {
      // optionally handle error
    }
  };

  const onSubmit = handleSubmit(() => onNext?.());

  function resolveCountryId(
    loc: any,
    countries: Country[],
  ): Country | undefined {
    const byCode = countries.find((c) => c.code2 == loc.___countryCode);

    if (byCode) return byCode;

    return countries.find(
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
          <Fieldset.Legend>Location</Fieldset.Legend>
          <Fieldset.HelperText>
            {isWeb
              ? "Provide webinar link"
              : "Enter the address and fine-tune it on the map."}
          </Fieldset.HelperText>
        </Stack>
        <Fieldset.Content mt={4}>
          <Stack gap="2vh" align="flex-start">
            <Flex gap="1vw" wrap="wrap">
              <Field.Root invalid={!!errors?.name} width={"40vw"}>
                <Field.Label>Name</Field.Label>
                <Input {...register("name")} />
                <Field.ErrorText>
                  {(errors as any)?.name?.message as any}
                </Field.ErrorText>
              </Field.Root>
            </Flex>
            <Flex gap="1vw" wrap="wrap">
              <Field.Root invalid={!!errors?.road} width={"30vw"}>
                <Field.Label>Street</Field.Label>
                <Input {...register("road")} />
                <Field.ErrorText>
                  {(errors as any)?.road?.message as any}
                </Field.ErrorText>
              </Field.Root>
              <Field.Root invalid={!!errors?.number} width={"9vw"}>
                <Field.Label>No.</Field.Label>
                <Input {...register("number")} />
                <Field.ErrorText>
                  {(errors as any)?.number?.message as any}
                </Field.ErrorText>
              </Field.Root>
            </Flex>
            <Flex gap="1vw" wrap="wrap">
              <Field.Root invalid={!!errors?.postalCode} width={"7vw"}>
                <Field.Label>Postal Code</Field.Label>
                <Input {...register("postalCode")} />
                <Field.ErrorText>
                  {(errors as any)?.postalCode?.message as any}
                </Field.ErrorText>
              </Field.Root>
              <Field.Root invalid={!!errors?.city} width={"13vw"}>
                <Field.Label>City</Field.Label>
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
                    const nextCountry = countries.find((c) => c.id === nextId);
                    setValue("countryId", nextId ?? "", {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                    setValue("country", nextCountry?.name || "", {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                >
                  <Select.HiddenSelect name="country" />
                  <Select.Label>Select Country</Select.Label>
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select country" />
                    </Select.Trigger>
                    <Select.Indicator />
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {countryCollection.items
                          .filter((item) => {
                            const country = countries.find(
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
                            const country = countries.find(
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
                Find on map
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
                  lat: lat,
                  lng: lng,
                  country: country,
                  countryId: selectedCountry,
                  locationTypeId: "",
                } as Location
              }
              title="Adjust Location"
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
                  setValue("country", match.name, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }

                setValue("name", loc.name || "");
                setValue("road", loc.road || "");
                setValue("number", loc.number || "");
                setValue("postalCode", loc.postalCode || "");
                setValue("city", loc.city || "");

                if (loc.lat != null)
                  setValue("lat", loc.lat, { shouldDirty: true });
                if (loc.lng != null)
                  setValue("lng", loc.lng, { shouldDirty: true });
              }}
            />
            <Flex gap="2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onPrevious?.()}
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

export default LocationPage;
