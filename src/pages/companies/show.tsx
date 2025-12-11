import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { useDelete, useOne } from "@refinedev/core";
import { useEffect } from "react";
import { LuArrowLeft, LuPencil, LuTrash2 } from "react-icons/lu";
import { useNavigate, useParams } from "react-router";
import { Company } from "../../features/companies/companies.model";
import { useLayout } from "../../providers/layout-provider";

const CompanyShowActions = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <>
      <Button onClick={() => navigate("/companies")} variant="ghost">
        <LuArrowLeft />
        Back to Companies
      </Button>
      <Button onClick={() => navigate(`/companies/edit/${id}`)} variant="ghost">
        <LuPencil />
        Edit
      </Button>
    </>
  );
};

const CompanyShowPage = () => {
  const { setTitle, setActions } = useLayout();
  const navigate = useNavigate();
  const { id } = useParams();
  const { mutate: deleteCompany } = useDelete();

  const { result: companyData } = useOne<Company>({
    resource: "companies",
    id: id!,
  });

  console.log("Company Data:", companyData);

  useEffect(() => {
    setTitle("Company Details");
    setActions(<CompanyShowActions />);
  }, [setTitle, setActions]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      deleteCompany(
        {
          resource: "companies",
          id: id!,
        },
        {
          onSuccess: () => {
            navigate("/companies");
          },
        },
      );
    }
  };

  if (!companyData) return <Box>Loading...</Box>;

  const company = companyData;

  return (
    <Box p={4}>
      <VStack gap={4} align="stretch">
        <Box>
          <Text fontWeight="bold">Name:</Text>
          <Text>{company.name}</Text>
        </Box>

        <Box>
          <Text fontWeight="bold">Sponsoring:</Text>
          <Text>{company.sponsoring ? "Yes" : "No"}</Text>
        </Box>

        {company.locationId && (
          <Box>
            <Text fontWeight="bold">Location ID:</Text>
            <Text>{company.locationId}</Text>
          </Box>
        )}

        <Button
          colorScheme="red"
          onClick={handleDelete}
          leftIcon={<LuTrash2 />}
        >
          Delete Company
        </Button>
      </VStack>
    </Box>
  );
};

export default CompanyShowPage;
