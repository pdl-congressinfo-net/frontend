import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useCreate, useList } from "@refinedev/core";
import { useLayout } from "../../providers/layout-provider";
import { Box, Button, VStack, Input, Field, Checkbox } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { CreateCompanyRequest } from "../../features/companies/companies.requests";
import { Location } from "../../features/locations/location.model";
import { LuArrowLeft } from "react-icons/lu";

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
          <Field label="Company Name" invalid={!!errors.name}>
            <Input {...register("name", { required: true })} />
          </Field>

          <Field label="Location">
            <select {...register("location_id")}>
              <option value="">Select a location</option>
              {locations?.data.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Sponsoring">
            <Checkbox {...register("sponsoring")}>Is Sponsoring</Checkbox>
          </Field>

          <Button type="submit" colorScheme="blue">
            Create Company
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CompanyCreatePage;
