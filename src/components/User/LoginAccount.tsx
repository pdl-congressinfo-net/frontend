import { Button, Field, Input, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { PasswordInput } from "../ui/password-input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@refinedev/core";

interface AccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoginFormValues {
  email: string;
  password: string;
}

const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});

export const LoginAccount = ({ isOpen, onClose }: AccountDialogProps) => {
  const { mutate: login } = useLogin<LoginFormValues>();
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
          <Field.Label>Email</Field.Label>
          <Input {...register("email")} />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password}>
          <Field.Label>Password</Field.Label>
          <PasswordInput {...register("password")} />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        <Button type="submit" disabled={!isValid}>
          Submit
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => alert("Forgot password flow")}
        >
          Forgot password?
        </Button>
      </Stack>
    </form>
  );
};
