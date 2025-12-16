import { Box, Button, HStack } from "@chakra-ui/react";
import { CanAccess, useNavigation, useTranslation } from "@refinedev/core";
import { DataTable } from "../../../components/Common/DataTable";
import { Contact } from "../../../features/users/users.model";

const ContactsListPage = () => {
  const { translate: t } = useTranslation();
  const { edit } = useNavigation();

  return (
    <Box p={4}>
      <DataTable
        resource="contacts"
        parentModule="users"
        columns={[
          {
            key: "email",
            header: "Email",
            sortable: true,
            searchable: true,
          },
          {
            key: "titles",
            header: "Title",
            sortable: true,
            searchable: true,
            visible: false,
          },
          {
            key: "lastName",
            header: "Last Name",
            sortable: true,
            searchable: true,
            visible: false,
          },
          {
            key: "firstName",
            header: "Name",
            sortable: true,
            searchable: true,
            render: (record: Contact) =>
              `${record.titles ?? ""} ${record.firstName ?? ""} ${record.lastName ?? ""}`.trim(),
          },
          { key: "phoneNumber", header: "Phone" },
          {
            key: "actions",
            header: "Actions",
            render: (record: Contact) => (
              <HStack>
                <CanAccess resource="contacts" action="update">
                  <Button
                    size="sm"
                    onClick={() => {
                      edit("contacts", record.id ?? "");
                    }}
                  >
                    Edit
                  </Button>
                </CanAccess>
              </HStack>
            ),
          },
        ]}
      />
    </Box>
  );
};

export default ContactsListPage;
