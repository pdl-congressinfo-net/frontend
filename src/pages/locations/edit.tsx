import { Box, Text } from "@chakra-ui/react";
import { useParams } from "react-router";

const LocationEditPage = () => {
  const { id } = useParams();

  return (
    <Box>
      <Text fontSize="xl" mb={4}>Edit Location</Text>
      <Text>TODO: Implement Location edit form for ID: {id}</Text>
    </Box>
  );
};

export default LocationEditPage;
