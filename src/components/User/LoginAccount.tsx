import { Button, Field, Input, Stack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin, useTranslation } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PasswordInput } from "../ui/password-input";

interface AccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginAccount = ({ onClose }: AccountDialogProps) => {
  const { translate: t } = useTranslation();
  const { mutate: login } = useLogin<LoginFormValues>();

  const RegisterSchema = z.object({
    email: z.string().email(t("auth.validation.invalidEmail")),
    password: z.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    login({ email: data.email, password: data.password });
    onClose();
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="4" align="flex-start" maxW="sm">
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

        <Button type="submit" disabled={!isValid}>
          {t("auth.submit")}
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => alert("Forgot password flow")}
        >
          {t("auth.forgotPassword")}
        </Button>
      </Stack>
    </form>
  );
};
