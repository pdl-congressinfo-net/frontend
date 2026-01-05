import { Box, Button, Field, Input, VStack } from "@chakra-ui/react";
import { useBack, useOne, useUpdate } from "@refinedev/core";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router";
import CountrySelector from "../../components/Location/CountrySelector";
import LocationTypeSelector from "../../components/Location/LocationTypeSelector";
import { Location } from "../../features/locations/location.model";
import { UpdateLocationRequest } from "../../features/locations/location.requests";
import { useLayout } from "../../providers/layout-provider";

const LocationEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { setTitle, setActions } = useLayout();
  const back = useBack();
  const { mutate: updateLocation } = useUpdate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<UpdateLocationRequest>();

  const {
    result: data,
    query: { isLoading },
  } = useOne<Location>({
    resource: "locations",
    id: id!,
  });

  const location = data;

  useEffect(() => {
    if (location) {
      reset({
        name: location.name,
        road: location.road,
        number: location.number,
        city: location.city,
        state: location.state,
        postal_code: location.postalCode,
        latitude: location.latitude,
        longitude: location.longitude,
        link: location.link,
        country_id: location.countryId,
        location_type_id: location.locationTypeId,
      });
    }
  }, [location, reset]);

  useEffect(() => {
    setTitle(location?.name || "Edit Location");
    setActions(null);
  }, [setTitle, setActions, location]);

  const onSubmit = (data: UpdateLocationRequest) => {
    updateLocation(
      {
        resource: "locations",
        id: id!,
        values: data,
      },
      {
        onSuccess: () => {
          back();
        },
      },
    );
  };

  if (isLoading) return <Box>Loading...</Box>;
  if (!location) return <Box>Location not found</Box>;

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4} align="stretch">
          <Field.Root invalid={!!errors.name}>
            <Field.Label>Name</Field.Label>
            <Input {...register("name")} />
            {errors.name && (
              <Field.ErrorText>This field is required</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root>
            <Field.Label>Road</Field.Label>
            <Input {...register("road")} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Number</Field.Label>
            <Input {...register("number")} />
          </Field.Root>

          <Field.Root>
            <Field.Label>City</Field.Label>
            <Input {...register("city")} />
          </Field.Root>

          <Field.Root>
            <Field.Label>State</Field.Label>
            <Input {...register("state")} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Postal Code</Field.Label>
            <Input {...register("postal_code")} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Latitude</Field.Label>
            <Input
              type="number"
              step="any"
              {...register("latitude", { valueAsNumber: true })}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Longitude</Field.Label>
            <Input
              type="number"
              step="any"
              {...register("longitude", { valueAsNumber: true })}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Link</Field.Label>
            <Input {...register("link")} />
          </Field.Root>

          <Field.Root>
            <Controller
              name="country_id"
              control={control}
              render={({ field }) => (
                <CountrySelector
                  value={field.value ?? null}
                  onChange={(val) => field.onChange(val ?? "")}
                  preferredFirst
                  width="100%"
                  size="md"
                />
              )}
            />
          </Field.Root>

          <Field.Root>
            <Controller
              name="location_type_id"
              control={control}
              render={({ field }) => (
                <LocationTypeSelector
                  value={field.value ?? null}
                  onChange={(val) => field.onChange(val ?? "")}
                  width="100%"
                  size="md"
                />
              )}
            />
          </Field.Root>

          <Button type="submit">Update Location</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default LocationEditPage;
