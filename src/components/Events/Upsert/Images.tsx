import {
  Button,
  Field,
  Fieldset,
  Flex,
  Image as ChakraImage,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { EventImagesFormValues } from "./types";
import { SaveResult, StepStatus } from "./form-shared";

type ImagesProps = {
  onNext?: () => void;
  onPrevious?: () => void;
  onStatus?: (status: StepStatus) => void;
  onSave?: (
    data: EventImagesFormValues,
  ) => Promise<SaveResult | void> | SaveResult | void;
  initialValues?: Partial<EventImagesFormValues>;
  onChange?: (
    value: EventImagesFormValues,
    meta?: { source: "user" | "sync" },
  ) => void;
  isSubmitting?: boolean;
};

const ImagesSchema = z
  .object({
    headerFile: z.instanceof(File).optional().nullable(),
    headerUrl: z.string().optional().nullable(),
    logoFile: z.instanceof(File).optional().nullable(),
    logoUrl: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (!data.headerFile && !data.headerUrl) {
      ctx.addIssue({
        path: ["headerFile"],
        code: z.ZodIssueCode.custom,
        message: "Header image is required",
      });
    }
    if (!data.logoFile && !data.logoUrl) {
      ctx.addIssue({
        path: ["logoFile"],
        code: z.ZodIssueCode.custom,
        message: "Logo image is required",
      });
    }
  });

const defaultValues: EventImagesFormValues = {
  headerFile: null,
  headerUrl: null,
  logoFile: null,
  logoUrl: null,
};

const createObjectUrl = (file: File) => URL.createObjectURL(file);

const revokeUrl = (url?: string | null) => {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

async function validateImageDimensions(
  file: File,
  expectedWidth: number,
  expectedHeight: number,
): Promise<{ valid: boolean; actual?: { width: number; height: number } }> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        valid: img.width === expectedWidth && img.height === expectedHeight,
        actual: { width: img.width, height: img.height },
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ valid: false });
    };
    img.src = objectUrl;
  });
}

const Images = ({
  onNext,
  onPrevious,
  onStatus,
  onSave,
  initialValues,
  onChange,
  isSubmitting,
}: ImagesProps) => {
  const syncingRef = useRef(false);
  const headerPreviewRef = useRef<string | null>(null);
  const logoPreviewRef = useRef<string | null>(null);

  const [headerPreview, setHeaderPreview] = useState<string | null>(
    initialValues?.headerFile instanceof File
      ? createObjectUrl(initialValues.headerFile)
      : (initialValues?.headerUrl ?? null),
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialValues?.logoFile instanceof File
      ? createObjectUrl(initialValues.logoFile)
      : (initialValues?.logoUrl ?? null),
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    trigger,
    clearErrors,
    setError,
    watch,
    formState: {
      errors,
      isValid,
      touchedFields,
      dirtyFields,
      isSubmitted,
      submitCount,
    },
  } = useForm<EventImagesFormValues>({
    mode: "onChange",
    defaultValues,
    resolver: zodResolver(ImagesSchema) as any,
    shouldUnregister: false,
  });

  useEffect(() => {
    register("headerFile");
    register("headerUrl");
    register("logoFile");
    register("logoUrl");
  }, [register]);

  const updatePreview = (
    value: File | string | null | undefined,
    kind: "header" | "logo",
  ) => {
    if (kind === "header") {
      revokeUrl(headerPreviewRef.current);
      if (value instanceof File) {
        const url = createObjectUrl(value);
        headerPreviewRef.current = url;
        setHeaderPreview(url);
      } else {
        headerPreviewRef.current = null;
        setHeaderPreview(value ?? null);
      }
    } else {
      revokeUrl(logoPreviewRef.current);
      if (value instanceof File) {
        const url = createObjectUrl(value);
        logoPreviewRef.current = url;
        setLogoPreview(url);
      } else {
        logoPreviewRef.current = null;
        setLogoPreview(value ?? null);
      }
    }
  };

  useEffect(() => {
    return () => {
      revokeUrl(headerPreviewRef.current);
      revokeUrl(logoPreviewRef.current);
    };
  }, []);

  useEffect(() => {
    if (!initialValues) return;
    syncingRef.current = true;
    reset({
      headerFile: initialValues.headerFile ?? null,
      headerUrl: initialValues.headerUrl ?? null,
      logoFile: initialValues.logoFile ?? null,
      logoUrl: initialValues.logoUrl ?? null,
    });
    updatePreview(
      initialValues.headerFile ?? initialValues.headerUrl ?? null,
      "header",
    );
    updatePreview(
      initialValues.logoFile ?? initialValues.logoUrl ?? null,
      "logo",
    );
    void trigger().finally(() => {
      syncingRef.current = false;
    });
  }, [initialValues, reset, trigger]);

  const ensureHeaderDimensions = async (file: File) => {
    const result = await validateImageDimensions(file, 650, 150);
    if (!result.valid) {
      setError("headerFile", {
        type: "manual",
        message: result.actual
          ? `Header must be 650x150px (got ${result.actual.width}x${result.actual.height})`
          : "Header must be 650x150px",
      });
      updatePreview(null, "header");
      return false;
    }
    clearErrors("headerFile");
    return true;
  };

  const ensureLogoDimensions = async (file: File) => {
    const result = await validateImageDimensions(file, 150, 150);
    if (!result.valid) {
      setError("logoFile", {
        type: "manual",
        message: result.actual
          ? `Logo must be 150x150px (got ${result.actual.width}x${result.actual.height})`
          : "Logo must be 150x150px",
      });
      updatePreview(null, "logo");
      return false;
    }
    clearErrors("logoFile");
    return true;
  };

  const handleHeaderChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const ok = await ensureHeaderDimensions(file);
    if (!ok) {
      setValue("headerFile", null, { shouldDirty: true, shouldTouch: true });
      return;
    }
    setValue("headerFile", file, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue("headerUrl", null, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    updatePreview(file, "header");
    void trigger();
  };

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const ok = await ensureLogoDimensions(file);
    if (!ok) {
      setValue("logoFile", null, { shouldDirty: true, shouldTouch: true });
      return;
    }
    setValue("logoFile", file, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue("logoUrl", null, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    updatePreview(file, "logo");
    void trigger();
  };

  const handleResetImage = (kind: "header" | "logo") => {
    if (kind === "header") {
      setValue("headerFile", null, { shouldDirty: true, shouldTouch: true });
      setValue("headerUrl", null, { shouldDirty: true, shouldTouch: true });
    } else {
      setValue("logoFile", null, { shouldDirty: true, shouldTouch: true });
      setValue("logoUrl", null, { shouldDirty: true, shouldTouch: true });
    }
    updatePreview(null, kind);
    void trigger();
  };

  useEffect(() => {
    if (!onChange) return;
    const subscription = watch((values) => {
      const meta = syncingRef.current
        ? ({ source: "sync" } as const)
        : ({ source: "user" } as const);
      onChange(values as EventImagesFormValues, meta);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

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

  const onSubmit = handleSubmit(async (values) => {
    try {
      await onSave?.(values);
      onNext?.();
    } catch (error) {
      console.error("Failed to persist images", error);
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <Fieldset.Root size="lg">
        <Stack>
          <Fieldset.Legend>Event Images</Fieldset.Legend>
          <Fieldset.HelperText>
            Upload a 650x150 header and a 150x150 logo. Previews update
            instantly.
          </Fieldset.HelperText>
        </Stack>
        <Fieldset.Content mt={4}>
          <Stack gap="4">
            <Field.Root invalid={!!errors.headerFile}>
              <Field.Label>Header Image (650x150)</Field.Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  void handleHeaderChange(event);
                }}
              />
              <Flex gap="4" mt={3} align="center">
                {headerPreview && (
                  <ChakraImage
                    src={headerPreview}
                    alt="Header preview"
                    maxW="320px"
                    borderRadius="md"
                    objectFit="cover"
                  />
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleResetImage("header")}
                  disabled={!headerPreview}
                >
                  Remove header
                </Button>
              </Flex>
              <Field.ErrorText>{errors.headerFile?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.logoFile}>
              <Field.Label>Logo (150x150)</Field.Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  void handleLogoChange(event);
                }}
              />
              <Flex gap="4" mt={3} align="center">
                {logoPreview && (
                  <ChakraImage
                    src={logoPreview}
                    alt="Logo preview"
                    boxSize="120px"
                    borderRadius="full"
                    objectFit="cover"
                  />
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleResetImage("logo")}
                  disabled={!logoPreview}
                >
                  Remove logo
                </Button>
              </Flex>
              <Field.ErrorText>{errors.logoFile?.message}</Field.ErrorText>
            </Field.Root>

            <Flex gap="2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onPrevious?.()}
              >
                Previous
              </Button>
              <Button type="submit" disabled={!isValid} loading={isSubmitting}>
                Next
              </Button>
            </Flex>
          </Stack>
        </Fieldset.Content>
      </Fieldset.Root>
    </form>
  );
};

export default Images;
