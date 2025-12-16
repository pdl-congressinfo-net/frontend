import { Box, Button, HStack, IconButton } from "@chakra-ui/react";
import { CanAccess, useNavigation, useTranslation } from "@refinedev/core";
import { useEffect } from "react";
import { LuCirclePlus } from "react-icons/lu";
import { DataTable } from "../../../components/Common/DataTable";
import { Contact } from "../../../features/users/users.model";
import { useLayout } from "../../../providers/layout-provider";

const ContactCreateActions = () => {
  const { create } = useNavigation();

  return (
    <IconButton
      onClick={() => create("contacts")}
      variant="ghost"
      aria-label="Create Contact"
      rounded="full"
    >
      <LuCirclePlus />
    </IconButton>
  );
};

const ContactsListPage = () => {
  const { translate: t } = useTranslation();
  const { edit } = useNavigation();
  const { setActions, setTitle } = useLayout();
  useEffect(() => {
    setTitle(t("admin.contacts.title", "Contacts"));
    setActions(<ContactCreateActions />);
  }, [setTitle, setActions]);

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
