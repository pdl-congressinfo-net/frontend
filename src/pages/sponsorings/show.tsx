import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useDelete, useNavigation, useOne } from "@refinedev/core";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import mapper from "../../features/companies/companies.mapper";
import { SponsoringDTO } from "../../features/companies/companies.responses";
import { useLayout } from "../../providers/layout-provider";

const SponsoringShowPage = () => {
  const { setTitle, setActions } = useLayout();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { edit } = useNavigation();
  const { mutate: deleteSponsoring } = useDelete();

  const { query } = useOne<SponsoringDTO>({ resource: "sponsorings", id: id! });
  const { data, isLoading } = query;
  const sponsoring = data?.data ? mapper.sponsorings(data.data) : undefined;

  useEffect(() => {
    setTitle("Sponsoring Details");
    setActions(
      <Button
        colorScheme="red"
        onClick={() => {
          if (window.confirm("Delete this sponsoring?")) {
            deleteSponsoring(
              { resource: "sponsorings", id: id! },
              { onSuccess: () => navigate("/admin/sponsorings") },
            );
          }
        }}
      >
        Delete Sponsoring
      </Button>,
    );
  }, [setTitle, setActions, id, deleteSponsoring, navigate]);

  if (isLoading) return <Box>Loading...</Box>;
  if (!sponsoring) return <Box>Not found</Box>;

  return (
    <Box p={4}>
      <VStack align="stretch" gap={4}>
        <Box>
          <Heading size="sm">Name</Heading>
          <Text>{sponsoring.name}</Text>
        </Box>
        <Box>
          <Heading size="sm">Value</Heading>
          <Text>{sponsoring.value}</Text>
        </Box>
        <Box>
          <Heading size="sm">Employee/Contact</Heading>
          <Text>{sponsoring.employeeId ?? sponsoring.contactId ?? "-"}</Text>
        </Box>
        <Box>
          <Heading size="sm">Event</Heading>
          <Text>{sponsoring.eventId ?? "-"}</Text>
        </Box>
        <Button onClick={() => edit("sponsorings", sponsoring.id!)}>
          Edit Sponsoring
        </Button>
      </VStack>
    </Box>
  );
};

export default SponsoringShowPage;
