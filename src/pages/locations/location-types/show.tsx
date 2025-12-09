import { Box, Text } from "@chakra-ui/react";
import { useParams } from "react-router";

const LocationTypeShowPage = () => {
  const { id } = useParams();

  return (
    <Box>
      <Text fontSize="xl" mb={4}>Location Type Details</Text>
      <Text>TODO: Implement LocationType detail view for ID: {id}</Text>
    </Box>
  );
};

export default LocationTypeShowPage;
