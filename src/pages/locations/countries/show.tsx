import { Box, Text } from "@chakra-ui/react";
import { useParams } from "react-router";

const CountryShowPage = () => {
  const { id } = useParams();

  return (
    <Box>
      <Text fontSize="xl" mb={4}>Country Details</Text>
      <Text>TODO: Implement Country detail view for ID: {id}</Text>
    </Box>
  );
};

export default CountryShowPage;
