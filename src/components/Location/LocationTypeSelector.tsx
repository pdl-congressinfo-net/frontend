import { createListCollection, Portal, Select } from "@chakra-ui/react";
import { useList, useTranslation } from "@refinedev/core";
import { useMemo } from "react";
import { LocationType } from "../../features/locations/location.model";

interface LocationTypeSelectorProps {
  value?: string | null;
  onChange?: (typeId: string | null) => void;
  width?: string | number;
  size?: "sm" | "md" | "lg";
}

const LocationTypeSelector = ({
  value,
  onChange,
  width = "18vw",
  size = "sm",
}: LocationTypeSelectorProps) => {
  const { translate: t } = useTranslation();

  const { result: types } = useList<LocationType>({
    resource: "types",
    meta: { parentModule: "locations" },
    pagination: { pageSize: 200 },
  });

  const collection = useMemo(
    () =>
      createListCollection<{ label: string; value: string }>({
        items: (Array.isArray(types.data) ? types.data : []).map(
          (type: LocationType) => ({
            // Use translated label so selected value shows translation too
            label: t("locations.types." + type.code, {
              defaultValue: type.code,
            }),
            value: type.id,
          }),
        ),
      }),
    [types.data],
  );

  return (
    <Select.Root
      collection={collection}
      size={size}
      width={width}
      colorPalette="blue"
      value={value ? [value] : []}
      onValueChange={(e) => {
        const nextId = Array.isArray(e.value) ? e.value[0] : e.value;
        onChange?.(nextId ?? null);
      }}
    >
      <Select.HiddenSelect name="location_type" />
      <Select.Label>{t("locations.form.fields.locationType")}</Select.Label>
      <Select.Control>
        <Select.Trigger _open={{ bg: "blue.50" }}>
          <Select.ValueText
            placeholder={t("locations.form.placeholders.selectType")}
          />
        </Select.Trigger>
        <Select.Indicator />
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {(collection.items || []).map((item) => (
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

export default LocationTypeSelector;
