import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useNavigation, useOne } from "@refinedev/core";
import { useParams } from "react-router";
import { Contact } from "../../../features/users/users.model";

const ContactShowPage = () => {
  const { id } = useParams<{ id: string }>();
  const { edit } = useNavigation();

  const {
    result: contact,
    query: { isLoading },
  } = useOne<Contact>({
    resource: "contacts",
    id: id!,
    meta: { parentModule: "users" },
  });

  if (isLoading) return <Box>Loading...</Box>;
  if (!contact) return <Box>Not found</Box>;

  return (
    <Box p={4}>
      <VStack align="stretch" gap={4}>
        <Box>
          <Heading size="sm">Email</Heading>
          <Text>{contact.email}</Text>
        </Box>
        <Box>
          <Heading size="sm">Name</Heading>
          <Text>
            {[contact.titles, contact.firstName, contact.lastName]
              .filter(Boolean)
              .join(" ")}
          </Text>
        </Box>
        {contact.phoneNumber && (
          <Box>
            <Heading size="sm">Phone</Heading>
            <Text>{contact.phoneNumber}</Text>
          </Box>
        )}
        <Button onClick={() => edit("contacts", contact.id!)}>
          Edit Contact
        </Button>
      </VStack>
    </Box>
  );
};

export default ContactShowPage;
