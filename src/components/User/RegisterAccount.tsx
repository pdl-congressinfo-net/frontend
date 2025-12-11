import { Button, Field, Input, Stack } from "@chakra-ui/react";
import { useForm, useFormState } from "react-hook-form";
import { PasswordInput } from "../ui/password-input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister, useTranslation } from "@refinedev/core";

interface AccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RegisterLoginFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormValues {
  full_name: string;
  email: string;
  password: string;
}

export const RegisterAccount = ({ onClose }: AccountDialogProps) => {
  const { translate: t } = useTranslation();
  const { mutate: registerUser } = useRegister<RegisterFormValues>();

  const RegisterSchema = z
    .object({
      name: z.string().min(1, t("auth.validation.nameRequired")),
      email: z.string().email(t("auth.validation.invalidEmail")),
      password: z.string().min(6, t("auth.validation.passwordMinLength")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.validation.passwordsNoMatch"),
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterLoginFormValues>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    registerUser({
      full_name: data.name,
      email: data.email,
      password: data.password,
    });
    onClose();
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="4" align="flex-start" maxW="sm">
        <Field.Root invalid={!!errors.name}>
          <Field.Label>{t("auth.fields.name")}</Field.Label>
          <Input {...register("name")} />
          <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.email}>
          <Field.Label>{t("auth.fields.email")}</Field.Label>
          <Input {...register("email")} />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password}>
          <Field.Label>{t("auth.fields.password")}</Field.Label>
          <PasswordInput {...register("password")} />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.confirmPassword}>
          <Field.Label>{t("auth.fields.confirmPassword")}</Field.Label>
          <PasswordInput {...register("confirmPassword")} />
          <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
        </Field.Root>

        <Button type="submit" disabled={!isValid}>
          {t("auth.submit")}
        </Button>
      </Stack>
    </form>
  );
};
