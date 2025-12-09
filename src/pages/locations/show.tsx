import { Box, Text } from "@chakra-ui/react";
import { useParams } from "react-router";

const LocationShowPage = () => {
  const { id } = useParams();

  return (
    <Box>
      <Text fontSize="xl" mb={4}>Location Details</Text>
      <Text>TODO: Implement Location detail view for ID: {id}</Text>
    </Box>
  );
};

export default LocationShowPage;
