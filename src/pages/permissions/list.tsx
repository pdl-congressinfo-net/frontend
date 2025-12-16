import { Box } from "@chakra-ui/react";
import { useList, useTranslation } from "@refinedev/core";
import { useEffect } from "react";
import { Permissions } from "../../components/Admin/Permissions";
import { Permission } from "../../features/permissions/permissions.model";
import { useLayout } from "../../providers/layout-provider";

const PermissionsListPage = () => {
  const { translate: t } = useTranslation();
  const { setTitle, setActions } = useLayout();
  const {
    query: { isLoading },
    result,
  } = useList<Permission>({
    resource: "permissions",
  });

  useEffect(() => {
    setTitle(t("admin.permissions.title"));
    setActions(null);
  }, [setTitle, setActions, t]);

  if (isLoading) return <Box>{t("common.loading")}</Box>;

  return <Permissions />;
};

export default PermissionsListPage;
