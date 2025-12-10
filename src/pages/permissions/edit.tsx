import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useOne, useUpdate } from "@refinedev/core";
import { useLayout } from "../../providers/layout-provider";
import { Box, Button, VStack, Input, Field } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { UpdatePermissionRequest } from "../../features/permissions/permissions.requests";
import { Permission } from "../../features/permissions/permissions.model";

const PermissionEditPage = () => {
  const { setTitle, setActions } = useLayout();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { mutate: updatePermission } = useUpdate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdatePermissionRequest>();

  const {
    result: permissionData,
    query: { isLoading },
  } = useOne<Permission>({
    resource: "permissions",
    id: id!,
  });

  useEffect(() => {
    if (permissionData) {
      reset({
        name: permissionData.name,
      });
    }
  }, [permissionData, reset]);

  useEffect(() => {
    setTitle("Edit Permission");
    setActions(null);
  }, [setTitle, setActions]);

  const onSubmit = (data: UpdatePermissionRequest) => {
    updatePermission(
      {
        resource: "permissions",
        id: id!,
        values: data,
      },
      {
        onSuccess: () => {
          navigate("/permissions");
        },
      },
    );
  };

  if (isLoading) return <Box>Loading...</Box>;

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

          <Button type="submit">Update Permission</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default PermissionEditPage;
