import { Box, Text } from "@chakra-ui/react";
import { useParams } from "react-router";

const LocationTypeEditPage = () => {
  const { id } = useParams();

  return (
    <Box>
      <Text fontSize="xl" mb={4}>Edit Location Type</Text>
      <Text>TODO: Implement LocationType edit form for ID: {id}</Text>
    </Box>
  );
};

export default LocationTypeEditPage;
