import { Box, Button, Table } from "@chakra-ui/react";
import { useList, useNavigation, useTranslation } from "@refinedev/core";
import { Contact } from "../../../features/users/users.model";

const ContactsListPage = () => {
  const { translate: t } = useTranslation();
  const { show } = useNavigation();
  const {
    result: data,
    query: { isLoading },
  } = useList<Contact>({
    resource: "contacts",
    meta: { parentModule: "users" },
  });

  console.log(data);

  if (isLoading) return <Box>{t("common.loading")}</Box>;

  const contacts = data?.data ?? [];

  console.log(contacts);

  return (
    <Box p={4}>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Phone</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {contacts.map((c) => (
            <Table.Row key={c.id}>
              <Table.Cell>{c.email}</Table.Cell>
              <Table.Cell>
                {[c.titles, c.firstName, c.lastName].filter(Boolean).join(" ")}
              </Table.Cell>
              <Table.Cell>{c.phoneNumber ?? "-"}</Table.Cell>
              <Table.Cell>
                <Button size="sm" onClick={() => show("contacts", c.id!)}>
                  View
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default ContactsListPage;
