import { Box, Button, Checkbox, Field, Input, VStack } from "@chakra-ui/react";
import { useList, useOne, useUpdate } from "@refinedev/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate, useParams } from "react-router";
import { Company } from "../../features/companies/companies.model";
import { UpdateCompanyRequest } from "../../features/companies/companies.requests";
import { Location } from "../../features/locations/location.model";
import { useLayout } from "../../providers/layout-provider";

const CompanyEditActions = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <>
      <Button onClick={() => navigate("/companies")} variant="ghost">
        <LuArrowLeft />
        Back to Companies
      </Button>
      <Button onClick={() => navigate(`/companies/show/${id}`)} variant="ghost">
        View Company
      </Button>
    </>
  );
};

const CompanyEditPage = () => {
  const { setTitle, setActions } = useLayout();
  const navigate = useNavigate();
  const { id } = useParams();
  const { mutate: updateCompany } = useUpdate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateCompanyRequest>();

  const { result: companyData } = useOne<Company>({
    resource: "companies",
    id: id!,
  });

  const { result: locations } = useList<Location>({
    resource: "locations",
  });

  useEffect(() => {
    if (companyData) {
      reset({
        name: companyData.name,
        sponsoring: companyData.sponsoring,
        location_id: companyData.locationId,
      });
    }
  }, [companyData, reset]);

  useEffect(() => {
    setTitle("Edit Company");
    setActions(<CompanyEditActions />);
  }, [setTitle, setActions]);

  const onSubmit = (data: UpdateCompanyRequest) => {
    updateCompany(
      {
        resource: "companies",
        id: id!,
        values: data,
      },
      {
        onSuccess: () => {
          navigate(`/companies/show/${id}`);
        },
      },
    );
  };

  if (!companyData) return <Box>Loading...</Box>;

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

export default CompanyEditPage;
