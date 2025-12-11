import { Box, Button, Field, Input, VStack } from "@chakra-ui/react";
import { useOne, useUpdate } from "@refinedev/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Role } from "../../features/roles/roles.model";
import { UpdateRoleRequest } from "../../features/roles/roles.requests";
import { useLayout } from "../../providers/layout-provider";

const RoleEditPage = () => {
  const { setTitle, setActions } = useLayout();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { mutate: updateRole } = useUpdate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateRoleRequest>();

  const { query, result } = useOne<Role>({
    resource: "roles",
    id: id!,
  });
  const { data: response, isLoading } = query;

  useEffect(() => {
    const role = result ?? response?.data;
    if (role) {
      reset({
        name: role.name,
      });
    }
  }, [result, response, reset]);

  useEffect(() => {
    setTitle("Edit Role");
    setActions(null);
  }, [setTitle, setActions]);

  const onSubmit = (data: UpdateRoleRequest) => {
    updateRole(
      {
        resource: "roles",
        id: id!,
        values: data,
      },
      {
        onSuccess: () => {
          navigate("/roles");
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

          <Button type="submit">Update Role</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default RoleEditPage;
