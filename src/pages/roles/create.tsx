import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useCreate } from "@refinedev/core";
import { useLayout } from "../../providers/layout-provider";
import { Box, Button, VStack, Input, Field } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { CreateRoleRequest } from "../../features/roles/roles.requests";

const RoleCreatePage = () => {
  const { setTitle, setActions } = useLayout();
  const navigate = useNavigate();
  const { mutate: createRole } = useCreate();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateRoleRequest>();

  useEffect(() => {
    setTitle("Create Role");
    setActions(null);
  }, [setTitle, setActions]);

  const onSubmit = (data: CreateRoleRequest) => {
    createRole(
      {
        resource: "roles",
        values: data,
      },
      {
        onSuccess: () => {
          navigate("/roles");
        },
      }
    );
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4} align="stretch">
          <Field.Root invalid={!!errors.name}>
            <Field.Label>Name</Field.Label>
            <Input {...register("name", { required: true })} />
            {errors.name && <Field.ErrorText>This field is required</Field.ErrorText>}
          </Field.Root>

          <Button type="submit">Create Role</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default RoleCreatePage;
