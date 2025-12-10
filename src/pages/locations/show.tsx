import { useEffect } from "react";
import { useParams } from "react-router";
import { useLayout } from "../../providers/layout-provider";
import { useOne, useNavigation } from "@refinedev/core";
import { Box, Button, VStack, Text } from "@chakra-ui/react";
import { Location } from "../../features/locations/location.model";

const LocationShowPage = () => {
  const { id } = useParams<{ id: string }>();
  const { setTitle, setActions } = useLayout();
  const { edit, list } = useNavigation();
  const { result: data, isLoading } = useOne<Location>({
    resource: "locations",
    id: id!,
  });

  const location = data?.data;

  useEffect(() => {
    setTitle(location?.name || "Location");
    setActions(
      <>
        <Button onClick={() => list("locations")}>Back to List</Button>
        <Button onClick={() => edit("locations", id!)}>Edit</Button>
      </>
    );
  }, [setTitle, setActions, location, edit, list, id]);

  if (isLoading) return <Box>Loading...</Box>;
  if (!location) return <Box>Location not found</Box>;

  return (
    <Box p={4}>
      <VStack align="stretch" gap={4}>
        <Box>
          <Text fontWeight="bold">Name:</Text>
          <Text>{location.name}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Address:</Text>
          <Text>
            {location.road} {location.number}
          </Text>
          <Text>
            {location.city}, {location.state} {location.postalCode}
          </Text>
        </Box>
        {location.latitude && location.longitude && (
          <Box>
            <Text fontWeight="bold">Coordinates:</Text>
            <Text>
              {location.latitude}, {location.longitude}
            </Text>
          </Box>
        )}
        {location.link && (
          <Box>
            <Text fontWeight="bold">Link:</Text>
            <Text as="a" href={location.link} target="_blank" color="blue.500">
              {location.link}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default LocationShowPage;