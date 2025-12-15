import { Badge, Button, Field, Flex, Input, Stack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister, useTranslation } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateUserRequest } from "../../features/users/users.requests";
import { PasswordInput } from "../ui/password-input";

interface AccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RegisterLoginFormValues {
  titles?: string;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterAccount = ({ onClose }: AccountDialogProps) => {
  const { translate: t } = useTranslation();
  const { mutate: registerUser } = useRegister<CreateUserRequest>();

  const RegisterSchema = z
    .object({
      titles: z.string().optional(),
      firstName: z.string().min(1, t("auth.validation.firstNameRequired")),
      lastName: z.string().optional(),
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
      titles: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    registerUser({
      contact: {
        titles: data.titles,
        first_name: data.firstName,
        last_name: data.lastName,
      },
      email: data.email,
      password: data.password,
    });
    onClose();
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="4" align="flex-start">
        <Flex gap="4" width="100%">
          <Field.Root invalid={!!errors.titles} maxW={"20%"}>
            <Field.Label>
              {t("auth.fields.titles")}
              <Field.RequiredIndicator
                fallback={
                  <Badge size="xs" variant="subtle">
                    {t("common.optional")}
                  </Badge>
                }
              />
            </Field.Label>
            <Input {...register("titles")} />
            <Field.ErrorText>{errors.titles?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.firstName} required>
            <Field.Label>
              {t("auth.fields.firstName")}
              <Field.RequiredIndicator />
            </Field.Label>
            <Input {...register("firstName")} />
            <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.lastName}>
            <Field.Label>
              {t("auth.fields.lastName")}
              <Field.RequiredIndicator
                fallback={
                  <Badge size="xs" variant="subtle">
                    {t("common.optional")}
                  </Badge>
                }
              />
            </Field.Label>
            <Input {...register("lastName")} />
            <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText>
          </Field.Root>
        </Flex>

        <Field.Root invalid={!!errors.email} required>
          <Field.Label>
            {t("auth.fields.email")}
            <Field.RequiredIndicator />
          </Field.Label>
          <Input {...register("email")} />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password} required>
          <Field.Label>
            {t("auth.fields.password")}
            <Field.RequiredIndicator />
          </Field.Label>
          <PasswordInput {...register("password")} />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.confirmPassword} required>
          <Field.Label>
            {t("auth.fields.confirmPassword")}
            <Field.RequiredIndicator />
          </Field.Label>
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
