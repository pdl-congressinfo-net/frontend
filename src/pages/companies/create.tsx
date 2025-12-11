import { Box, Button, Checkbox, Field, Input, VStack } from "@chakra-ui/react";
import { useCreate, useList } from "@refinedev/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router";
import { CreateCompanyRequest } from "../../features/companies/companies.requests";
import { Location } from "../../features/locations/location.model";
import { useLayout } from "../../providers/layout-provider";

const CompanyCreateActions = () => {
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate("/companies")} variant="ghost">
      <LuArrowLeft />
      Back to Companies
    </Button>
  );
};

const CompanyCreatePage = () => {
  const { setTitle, setActions } = useLayout();
  const navigate = useNavigate();
  const { mutate: createCompany } = useCreate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCompanyRequest>();

  const { result: locations } = useList<Location>({
    resource: "locations",
  });

  useEffect(() => {
    setTitle("Create Company");
    setActions(<CompanyCreateActions />);
  }, [setTitle, setActions]);

  const onSubmit = (data: CreateCompanyRequest) => {
    createCompany(
      {
        resource: "companies",
        values: data,
      },
      {
        onSuccess: () => {
          navigate("/companies");
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

          <Field.Root>
            <Field.Label>Location</Field.Label>
            <select {...register("location_id")}>
              <option value="">Select a location</option>
              {locations?.data.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </Field.Root>

          <Field.Root>
            <Field.Label>Sponsoring</Field.Label>
            <Checkbox.Root>
              <Checkbox.HiddenInput {...register("sponsoring")} />
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Box as="span" ml={2}>
                Is Sponsoring
              </Box>
            </Checkbox.Root>
          </Field.Root>

          <Button type="submit" colorScheme="blue">
            Create Company
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CompanyCreatePage;
