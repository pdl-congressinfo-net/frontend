import { useEffect } from "react";
import { useLayout } from "../../providers/layout-provider";
import { useList, useNavigation, useTranslation } from "@refinedev/core";
import { Box, Button, Table } from "@chakra-ui/react";
import { Permission } from "../../features/permissions/permissions.model";
import { Permissions } from "../../components/Admin/Permissions";

const PermissionsListActions = () => {
  const { translate: t } = useTranslation();
  const { create } = useNavigation();
  return (
    <Button onClick={() => create("permissions")}>{t("admin.permissions.actions.create")}</Button>
  );
};

const PermissionsListPage = () => {
  const { translate: t } = useTranslation();
  const { setTitle, setActions } = useLayout();
  const { edit, show } = useNavigation();
  const {
    query: { isLoading },
    result,
  } = useList<Permission>({
    resource: "permissions",
  });

  useEffect(() => {
    setTitle(t("admin.permissions.title"));
    setActions(<PermissionsListActions />);
  }, [setTitle, setActions, t]);

  if (isLoading) return <Box>{t("common.loading")}</Box>;

  return <Permissions />;
};

export default PermissionsListPage;
