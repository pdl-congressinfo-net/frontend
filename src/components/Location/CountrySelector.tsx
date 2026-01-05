import {
  createListCollection,
  Portal,
  Select,
  Separator,
} from "@chakra-ui/react";
import { useList, useTranslation } from "@refinedev/core";
import { useMemo } from "react";
import { Country } from "../../features/locations/location.model";

interface CountrySelectorProps {
  value?: string | null;
  onChange?: (countryId: string | null) => void;
  preferredFirst?: boolean;
  width?: string | number;
  size?: "sm" | "md" | "lg";
}

const CountrySelector = ({
  preferredFirst = true,
  value,
  onChange,
  width = "18vw",
  size = "sm",
}: CountrySelectorProps) => {
  const { translate: t } = useTranslation();

  const { result: countries } = useList<Country>({
    resource: "countries",
    meta: { parentModule: "locations" },
    pagination: {
      pageSize: 200,
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

  return (
    <Select.Root
      collection={countryCollection}
      size={size}
      width={width}
      colorPalette="blue"
      value={value ? [value] : []}
      onValueChange={(e) => {
        const nextId = Array.isArray(e.value) ? e.value[0] : e.value;
        onChange?.(nextId ?? null);
      }}
    >
      <Select.HiddenSelect name="country" />
      <Select.Label>{t("locations.form.fields.country")}</Select.Label>
      <Select.Control>
        <Select.Trigger _open={{ bg: "blue.50" }}>
          <Select.ValueText
            placeholder={t("locations.form.placeholders.selectCountry")}
          />
        </Select.Trigger>
        <Select.Indicator />
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {countryCollection.items
              .filter((item) => {
                const country = (countries.data ?? []).find(
                  (c) => c.id === item.value,
                );
                return preferredFirst ? country?.preferred : true;
              })
              .map((item) => (
                <Select.Item
                  key={item.value}
                  item={item}
                  _selected={{ bg: "blue.100" }}
                >
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            {preferredFirst && <Separator size={"lg"} />}
            {countryCollection.items
              .filter((item) => {
                const country = (countries.data ?? []).find(
                  (c) => c.id === item.value,
                );
                return preferredFirst ? !country?.preferred : false;
              })
              .map((item) => (
                <Select.Item
                  key={item.value}
                  item={item}
                  _selected={{ bg: "blue.100" }}
                >
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};

export default CountrySelector;
