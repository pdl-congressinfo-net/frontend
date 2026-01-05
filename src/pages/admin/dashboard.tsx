import { Text } from "@chakra-ui/react";
import { useTranslation } from "@refinedev/core";
import { useEffect } from "react";
import { useLayout } from "../../providers/layout-provider";

const AdminDashboard = () => {
  const { translate: t } = useTranslation();
  const { setTitle, setActions } = useLayout();

  useEffect(() => {
    setTitle(t("admin.dashboard.title"));
    setActions(null);
  }, [setTitle, t]);

  return <Text>{t("admin.dashboard.welcome")}</Text>;
};

export default AdminDashboard;
