import {
  Combobox,
  Field,
  Portal,
  Spinner,
  createListCollection,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { Controller } from "react-hook-form";

interface ComboboxTranslation {
  field: string;
  loading: string;
  error: string;
  noOptionsFound: string;
  fieldsPlaceholder: string;
}

interface CustomComboBoxProps {
  field: string;
  control: any;
  errors: any;
  isLoading: boolean;
  items: any[];
  itemLabel: string;
  itemValue: string;
  handleInputChange: (inputValue: string) => void;
  translation: ComboboxTranslation;
}

export const CustomCombobox = ({
  field,
  control,
  errors,
  isLoading,
  items,
  itemLabel,
  itemValue,
  handleInputChange,
  translation,
}: CustomComboBoxProps) => {
  // Create collection from items
  const collection = useMemo(
    () =>
      createListCollection({
        items,
        itemToString: (item) => item[itemLabel],
        itemToValue: (item) => String(item[itemValue]),
      }),
    [items, itemLabel, itemValue],
  );

  return (
    <Controller
      control={control}
      name={field}
      render={({ field: fieldProps }) => (
        <Field.Root invalid={!!errors[fieldProps.name]}>
          <Field.Label>{translation.field}</Field.Label>
          <Combobox.Root
            collection={collection}
            value={fieldProps.value ? [String(fieldProps.value)] : []}
            onValueChange={({ value }) => {
              fieldProps.onChange(value[0] || "");
            }}
            onInputValueChange={({ inputValue }) => {
              handleInputChange(inputValue);
            }}
          >
            <Combobox.Control>
              <Combobox.Input
                placeholder={translation.fieldsPlaceholder}
                onBlur={() => fieldProps.onBlur()}
              />
              <Combobox.IndicatorGroup>
                <Combobox.ClearTrigger />
                {isLoading && <Spinner size="sm" />}
                {!isLoading && <Combobox.Trigger />}
              </Combobox.IndicatorGroup>
            </Combobox.Control>

            <Portal>
              <Combobox.Positioner>
                <Combobox.Content>
                  {isLoading ? (
                    <Combobox.Empty>{translation.loading}</Combobox.Empty>
                  ) : collection.items.length === 0 ? (
                    <Combobox.Empty>
                      {translation.noOptionsFound}
                    </Combobox.Empty>
                  ) : (
                    collection.items.map((item) => (
                      <Combobox.Item key={String(item[itemValue])} item={item}>
                        {item[itemLabel]}
                        <Combobox.ItemIndicator />
                      </Combobox.Item>
                    ))
                  )}
                </Combobox.Content>
              </Combobox.Positioner>
            </Portal>
          </Combobox.Root>
          <Field.ErrorText>
            {errors[fieldProps.name] && translation.error}
          </Field.ErrorText>
        </Field.Root>
      )}
    />
  );
};
