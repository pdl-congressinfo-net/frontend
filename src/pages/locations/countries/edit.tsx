import { Box, Text } from "@chakra-ui/react";
import { useParams } from "react-router";

const CountryEditPage = () => {
  const { id } = useParams();

  return (
    <Box>
      <Text fontSize="xl" mb={4}>Edit Country</Text>
      <Text>TODO: Implement Country edit form for ID: {id}</Text>
    </Box>
  );
};

export default CountryEditPage;
