import { Combobox, Field, Portal, Spinner } from "@chakra-ui/react";
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
  key?: string;
  value?: string;
  control: any;
  errors: any;
  isLoading: boolean;
  collection: any;
  handleInputChange: (details: Combobox.InputValueChangeDetails) => void;
  translation: ComboboxTranslation;
}

export const CustomCombobox = ({
  field,
  key = "id",
  value = "value",
  control,
  errors,
  isLoading,
  collection,
  handleInputChange,
  translation,
}: CustomComboBoxProps) => {
  return (
    <Controller
      control={control}
      name={field}
      render={({ field }) => (
        <Field.Root invalid={!!errors[field.name]} required>
          <Field.Label>{translation.field}</Field.Label>
          <Combobox.Root
            collection={collection}
            value={field.value ? [field.value] : []}
            onValueChange={({ value }) => field.onChange(value[0] || "")}
            onInputValueChange={handleInputChange}
            onInteractOutside={() => field.onBlur()}
            openOnClick
          >
            <Combobox.Control>
              <Combobox.Input placeholder={translation.fieldsPlaceholder} />
              <Combobox.IndicatorGroup>
                <Combobox.ClearTrigger />
                {isLoading && <Spinner size="sm" />}
                {!isLoading && <Combobox.Trigger />}
              </Combobox.IndicatorGroup>
            </Combobox.Control>

            <Portal>
              <Combobox.Positioner>
                <Combobox.Content>
                  {collection.items.length === 0 ? (
                    <Combobox.Empty>
                      {isLoading
                        ? translation.loading
                        : translation.noOptionsFound}
                    </Combobox.Empty>
                  ) : (
                    collection.items.map((item) => (
                      <Combobox.Item key={item[key]} item={item}>
                        {item[value]}
                        <Combobox.ItemIndicator />
                      </Combobox.Item>
                    ))
                  )}
                </Combobox.Content>
              </Combobox.Positioner>
            </Portal>
          </Combobox.Root>
          <Field.ErrorText>
            {errors[field.name] && translation.error}
          </Field.ErrorText>
        </Field.Root>
      )}
    />
  );
};
