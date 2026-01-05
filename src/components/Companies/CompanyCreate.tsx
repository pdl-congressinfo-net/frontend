import { Button, Checkbox, Field, Fieldset, Input } from "@chakra-ui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useCreate, useList, useTranslation } from "@refinedev/core";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import z from "zod";
import { Location } from "../../features/locations/location.model";
import { CustomCombobox } from "../ui/forms/combobox";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location_id: z.string().optional(),
  sponsoring: z.boolean().optional(),
});

export const CompanyCreate = () => {
  const { translate: t } = useTranslation();
  const { mutate: createCompany } = useCreate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: standardSchemaResolver(formSchema),
  });

  const [searchValue, setSearchValue] = useState("");

  // Server-side async fetch with search filter
  const {
    result: { data: locationsResult },
    query: { isLoading },
  } = useList<Location>({
    resource: "locations",
    pagination: { pageSize: 1000 },
    filters: searchValue
      ? [
          {
            field: "name",
            operator: "contains",
            value: searchValue,
          },
        ]
      : [],
  });

  const locations = locationsResult || [];

  const handleInputChange = (inputValue: string) => {
    // Update search value to trigger server-side filtering
    setSearchValue(inputValue);
  };

  const onSubmit = handleSubmit((data) => {
    createCompany(
      {
        resource: "companies",
        values: data,
      },
      {
        onSuccess: () => {
          // Navigate to companies list or show success message
        },
      },
    );
  });

  return (
    <Fieldset.Root>
      <Fieldset.Legend>{t("companies.create.title")}</Fieldset.Legend>
      <Fieldset.HelperText>
        {t("companies.create.helperText")}
      </Fieldset.HelperText>
      <Fieldset.Content>
        <form onSubmit={onSubmit}>
          <Field.Root invalid={!!errors.name} required>
            <Field.Label>{t("companies.fields.name")}</Field.Label>
            <Input {...register("name", { required: true })} />
            <Field.ErrorText>
              {errors.name && t("companies.errors.nameRequired")}
            </Field.ErrorText>
          </Field.Root>
          <CustomCombobox
            field="location_id"
            control={control}
            errors={errors}
            items={locations}
            itemLabel="name"
            itemValue="id"
            isLoading={isLoading}
            handleInputChange={handleInputChange}
            translation={{
              field: t("companies.fields.location"),
              loading: t("companies.loadingLocations"),
              error: t("companies.errors.loadingLocations"),
              noOptionsFound: t("companies.errors.noLocationsFound"),
              fieldsPlaceholder: t("companies.fields.locationPlaceholder"),
            }}
          />
          <Controller
            control={control}
            name="sponsoring"
            render={({ field }) => (
              <Field.Root
                invalid={!!errors.sponsoring}
                disabled={field.disabled}
              >
                <Checkbox.Root
                  checked={field.value}
                  onCheckedChange={({ checked }) => field.onChange(checked)}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>
                    {t("companies.fields.sponsoring")}
                  </Checkbox.Label>
                </Checkbox.Root>
                <Field.ErrorText>
                  {errors.sponsoring &&
                    t("companies.errors.sponsoringRequired")}
                </Field.ErrorText>
              </Field.Root>
            )}
          />
          <Button type="submit" mt="4" colorScheme="blue">
            {t("companies.create.submitButton")}
          </Button>
        </form>
      </Fieldset.Content>
    </Fieldset.Root>
  );
};
export default CompanyCreate;
