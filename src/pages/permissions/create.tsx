import { Box, Button, Field, Input, VStack } from "@chakra-ui/react";
import { useCreate } from "@refinedev/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { CreatePermissionRequest } from "../../features/permissions/permissions.requests";
import { useLayout } from "../../providers/layout-provider";

const PermissionCreatePage = () => {
  const { setTitle, setActions } = useLayout();
  const navigate = useNavigate();
  const { mutate: createPermission } = useCreate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePermissionRequest>();

  useEffect(() => {
    setTitle("Create Permission");
    setActions(null);
  }, [setTitle, setActions]);

  const onSubmit = (data: CreatePermissionRequest) => {
    createPermission(
      {
        resource: "permissions",
        values: data,
      },
      {
        onSuccess: () => {
          navigate("/permissions");
        },
      },
    );
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4} align="stretch">
          <Field.Root invalid={!!errors.name}>
            <Field.Label>Name</Field.Label>
            <Input {...register("name", { required: true })} />
            {errors.name && (
              <Field.ErrorText>This field is required</Field.ErrorText>
            )}
          </Field.Root>

          <Button type="submit">Create Permission</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default PermissionCreatePage;
