import { Box, Button, Field, Input, VStack } from "@chakra-ui/react";
import { useCreate, useList, useTranslation } from "@refinedev/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Country, LocationType } from "../../features/locations/location.model";
import { CreateLocationRequest } from "../../features/locations/location.requests";
import { useLayout } from "../../providers/layout-provider";

const LocationCreatePage = () => {
  const { translate: t } = useTranslation();
  const { setTitle, setActions } = useLayout();
  const navigate = useNavigate();
  const { mutate: createLocation } = useCreate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLocationRequest>();

  const { result: countries } = useList<Country>({
    resource: "countries",
    meta: { parentmodule: "locations" },
  });

  const { result: locationTypes } = useList<LocationType>({
    resource: "locationtypes",
    meta: { parentmodule: "locations" },
  });

  useEffect(() => {
    setTitle(t("admin.locations.actions.create"));
    setActions(null);
  }, [setTitle, setActions, t]);

  const onSubmit = (data: CreateLocationRequest) => {
    createLocation(
      {
        resource: "locations",
        values: data,
      },
      {
        onSuccess: () => {
          navigate("/locations");
        },
      },
    );
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4} align="stretch">
          <Field.Root invalid={!!errors.name}>
            <Field.Label>{t("locations.form.fields.name.label")}</Field.Label>
            <Input {...register("name", { required: true })} />
            {errors.name && (
              <Field.ErrorText>
                {t("common.validation.required")}
              </Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root>
            <Field.Label>{t("locations.form.fields.road.label")}</Field.Label>
            <Input {...register("road")} />
          </Field.Root>

          <Field.Root>
            <Field.Label>{t("locations.form.fields.number.label")}</Field.Label>
            <Input {...register("number")} />
          </Field.Root>

          <Field.Root>
            <Field.Label>{t("locations.form.fields.city.label")}</Field.Label>
            <Input {...register("city")} />
          </Field.Root>

          <Field.Root>
            <Field.Label>{t("locations.form.fields.state.label")}</Field.Label>
            <Input {...register("state")} />
          </Field.Root>

          <Field.Root>
            <Field.Label>
              {t("locations.form.fields.postalCode.label")}
            </Field.Label>
            <Input {...register("postal_code")} />
          </Field.Root>

          <Field.Root>
            <Field.Label>
              {t("locations.form.fields.latitude.label")}
            </Field.Label>
            <Input
              type="number"
              step="any"
              {...register("latitude", { valueAsNumber: true })}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>
              {t("locations.form.fields.longitude.label")}
            </Field.Label>
            <Input
              type="number"
              step="any"
              {...register("longitude", { valueAsNumber: true })}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>{t("locations.form.fields.link.label")}</Field.Label>
            <Input {...register("link")} />
          </Field.Root>

          <Field.Root>
            <Field.Label>
              {t("locations.form.fields.country.label")}
            </Field.Label>
            <select {...register("country_id")}>
              <option value="">
                {t("locations.form.fields.country.placeholder")}
              </option>
              {countries?.data.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </Field.Root>

          <Field.Root>
            <Field.Label>
              {t("locations.form.fields.locationType.label")}
            </Field.Label>
            <select {...register("location_type_id")}>
              <option value="">
                {t("locations.form.fields.locationType.placeholder")}
              </option>
              {locationTypes?.data.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </Field.Root>

          <Button type="submit">{t("admin.locations.actions.create")}</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default LocationCreatePage;
