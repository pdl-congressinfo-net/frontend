import { Button, Field, Input, Stack } from "@chakra-ui/react";
import { useForm, useFormState } from "react-hook-form";
import { PasswordInput } from "../ui/password-input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@refinedev/core";

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

const RegisterSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const RegisterAccount = ({ onClose }: AccountDialogProps) => {
  const { mutate: registerUser } = useRegister<RegisterFormValues>();
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
          <Field.Label>Name</Field.Label>
          <Input {...register("name")} />
          <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.email}>
          <Field.Label>Email</Field.Label>
          <Input {...register("email")} />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password}>
          <Field.Label>Password</Field.Label>
          <PasswordInput {...register("password")} />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.confirmPassword}>
          <Field.Label>Confirm Password</Field.Label>
          <PasswordInput {...register("confirmPassword")} />
          <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
        </Field.Root>

        <Button type="submit" disabled={!isValid}>
          Submit
        </Button>
      </Stack>
    </form>
  );
};
