import { useTranslation } from "@refinedev/core";
import { useEffect } from "react";
import { Permissions } from "../../components/Admin/Permissions";
import { useLayout } from "../../providers/layout-provider";

const PermissionsListPage = () => {
  const { translate: t } = useTranslation();
  const { setTitle, setActions } = useLayout();

  useEffect(() => {
    setTitle(t("admin.permissions.title"));
    setActions(null);
  }, [setTitle, setActions, t]);

  return <Permissions />;
};

export default PermissionsListPage;
