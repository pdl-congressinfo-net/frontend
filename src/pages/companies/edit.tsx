import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useOne, useUpdate, useList } from "@refinedev/core";
import { useLayout } from "../../providers/layout-provider";
import { Box, Button, VStack, Input, Field, Checkbox } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { UpdateCompanyRequest } from "../../features/companies/companies.requests";
import { Company } from "../../features/companies/companies.model";
import { Location } from "../../features/locations/location.model";
import { LuArrowLeft } from "react-icons/lu";

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
    if (companyData?.data) {
      reset({
        name: companyData.data.name,
        sponsoring: companyData.data.sponsoring,
        location_id: companyData.data.locationId,
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

  if (!companyData?.data) return <Box>Loading...</Box>;

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4} align="stretch">
          <Field label="Company Name" invalid={!!errors.name}>
            <Input {...register("name")} />
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
            Update Company
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CompanyEditPage;
