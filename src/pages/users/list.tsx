import { Box, IconButton } from "@chakra-ui/react";
import { useNavigation, useTranslation } from "@refinedev/core";
import { useEffect } from "react";
import { LuCirclePlus } from "react-icons/lu";
import { DataTable } from "../../components/Common/DataTable";
import { User } from "../../features/users/users.model";
import { useLayout } from "../../providers/layout-provider";

const UserCreateActions = () => {
  const { create } = useNavigation();

  return (
    <IconButton
      onClick={() => create("users")}
      variant="ghost"
      aria-label="Create User"
      rounded="full"
    >
      <LuCirclePlus />
    </IconButton>
  );
};

const UsersListPage = () => {
  const { translate: t } = useTranslation();

  const { setActions, setTitle } = useLayout();
  useEffect(() => {
    setTitle(t("admin.users.title", "Users"));
    setActions(<UserCreateActions />);
  }, [setTitle, setActions]);

  return (
    <Box p={4}>
      <DataTable
        resource="users"
        columns={[
          {
            key: "title",
            header: t("admin.users.table.title"),
            searchable: true,
            sortable: true,
            visible: false,
          },
          {
            key: "firstName",
            header: t("admin.users.table.firstName"),
            searchable: true,
            sortable: true,
            visible: false,
          },
          {
            key: "lastName",
            header: t("admin.users.table.name"),
            searchable: true,
            sortable: true,
            render: (record) => {
              const user = record as unknown as User;
              return [
                user.contact?.titles,
                user.contact?.firstName,
                user.contact?.lastName,
              ]
                .filter(Boolean)
                .join(" ");
            },
          },
          {
            key: "email",
            header: t("admin.users.table.email"),
            searchable: true,
            sortable: true,
          },
          {
            key: "oeakId",
            header: t("admin.users.table.oeakId"),
            sortable: true,
          },
          {
            key: "lastLogin",
            header: t("admin.users.table.lastLogin"),
            sortable: true,
            isDate: true,
          },
        ]}
      />
    </Box>
  );
};

export default UsersListPage;
