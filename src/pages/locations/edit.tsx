import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useUpdate, useOne, useList } from "@refinedev/core";
import { useLayout } from "../../providers/layout-provider";
import { Box, Button, VStack, Input, Field } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { UpdateLocationRequest } from "../../features/locations/location.requests";
import {
  Location,
  Country,
  LocationType,
} from "../../features/locations/location.model";

const LocationEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { setTitle, setActions } = useLayout();
  const navigate = useNavigate();
  const { mutate: updateLocation } = useUpdate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateLocationRequest>();

  const {
    result: data,
    query: { isLoading },
  } = useOne<Location>({
    resource: "locations",
    id: id!,
  });

  const { result: countries } = useList<Country>({
    resource: "countries",
    meta: { parentmodule: "locations" },
  });

  const { result: locationTypes } = useList<LocationType>({
    resource: "locationtypes",
    meta: { parentmodule: "locations" },
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
          navigate(`/locations/show/${id}`);
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
            <Field.Label>Country</Field.Label>
            <select {...register("country_id")}>
              <option value="">Select a country</option>
              {countries?.data.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </Field.Root>

          <Field.Root>
            <Field.Label>Location Type</Field.Label>
            <select {...register("location_type_id")}>
              <option value="">Select a type</option>
              {locationTypes?.data.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </Field.Root>

          <Button type="submit">Update Location</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default LocationEditPage;
