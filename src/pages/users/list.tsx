import { Box, Button, Table } from "@chakra-ui/react";
import {
  useLink,
  useList,
  useNavigation,
  useTranslation,
} from "@refinedev/core";
import { useEffect } from "react";
import { User } from "../../features/users/users.model";
import { useLayout } from "../../providers/layout-provider";

const UsersListPage = () => {
  const { translate: t } = useTranslation();
  const { setTitle, setActions } = useLayout();
  const { show } = useNavigation();
  const Link = useLink();
  const {
    result: data,
    query: { isLoading },
  } = useList<User>({
    resource: "users",
  });

  useEffect(() => {
    setTitle(t("admin.users.title"));
    setActions(
      <Link to="/admin/users/create">
        <Button>{t("admin.users.actions.create")}</Button>
      </Link>,
    );
    return () => setActions(null);
  }, [setTitle, setActions, t]);

  if (isLoading) return <Box>{t("common.loading")}</Box>;

  return (
    <Box p={4}>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>
              {t("admin.users.table.name")}
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              {t("admin.users.table.email")}
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              {t("admin.users.table.oeakId")}
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              {t("admin.users.table.lastLogin")}
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              {t("admin.users.table.actions")}
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.data.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell>
                {[user.titles, user.firstName, user.lastName]
                  .filter(Boolean)
                  .join(" ")}
              </Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.oeakId || "-"}</Table.Cell>
              <Table.Cell>
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleDateString()
                  : "-"}
              </Table.Cell>
              <Table.Cell>
                <Button
                  size="sm"
                  onClick={() => show("users", user.id.toString())}
                >
                  {t("common.actions.view")}
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default UsersListPage;
