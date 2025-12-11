import { Box, Button } from "@chakra-ui/react";
import { useList, useNavigation, useTranslation } from "@refinedev/core";
import { useEffect } from "react";
import { Permissions } from "../../components/Admin/Permissions";
import { Permission } from "../../features/permissions/permissions.model";
import { useLayout } from "../../providers/layout-provider";

const PermissionsListActions = () => {
  const { translate: t } = useTranslation();
  const { create } = useNavigation();
  return (
    <Button onClick={() => create("permissions")}>
      {t("admin.permissions.actions.create")}
    </Button>
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
