import { Button, Checkbox, Field, Fieldset, Input } from "@chakra-ui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  useList,
  useOne,
  useResourceParams,
  useTranslation,
  useUpdate,
} from "@refinedev/core";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import z from "zod";
import { Company } from "../../features/companies/companies.model";
import { Location } from "../../features/locations/location.model";
import { CustomCombobox } from "../ui/forms/combobox";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location_id: z.string().optional(),
  sponsoring: z.boolean().optional(),
});

export const CompanyEdit = () => {
  const { translate: t } = useTranslation();
  const { id } = useResourceParams();

  const { mutate: editCompany } = useUpdate();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: standardSchemaResolver(formSchema),
  });

  const [searchValue, setSearchValue] = useState("");

  // Fetch the company being edited
  const {
    result: companyResult,
    query: { isLoading: companyIsLoading },
  } = useOne<Company>({
    resource: "companies",
    id: id!,
  });

  // Fetch the selected location by ID if it exists
  const {
    result: selectedLocationResult,
    query: { isLoading: selectedLocationIsLoading },
  } = useOne<Location>({
    resource: "locations",
    id: companyResult?.locationId!,
    queryOptions: {
      enabled: !!companyResult?.locationId,
    },
  });

  // Reset form when company data loads
  useEffect(() => {
    if (!companyResult) return;

    reset({
      name: companyResult.name,
      location_id: String(companyResult.locationId ?? ""),
      sponsoring: companyResult.sponsoring ?? false,
    });
  }, [companyResult, reset]);

  // Server-side fetch locations with search filter
  const {
    result: { data: locationsResult },
    query: { isLoading: locationsIsLoading },
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

  const searchedLocations = locationsResult || [];

  // Merge selected location with search results
  const locations = useMemo(() => {
    const list = [...searchedLocations];

    // If we have a selected location that's not in the search results, prepend it
    if (selectedLocationResult) {
      const alreadyExists = list.some(
        (loc) => loc.id === selectedLocationResult.id,
      );

      if (!alreadyExists) {
        list.unshift(selectedLocationResult);
      }
    }

    return list;
  }, [searchedLocations, selectedLocationResult]);

  const isLoading =
    companyIsLoading || locationsIsLoading || selectedLocationIsLoading;

  const handleInputChange = (inputValue: string) => {
    setSearchValue(inputValue);
  };

  const onSubmit = handleSubmit((data) => {
    editCompany(
      {
        resource: "companies",
        values: data,
        id: id!,
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
export default CompanyEdit;
