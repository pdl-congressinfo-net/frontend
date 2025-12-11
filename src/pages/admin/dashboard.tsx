import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useLayout } from "../../providers/layout-provider";
import { Text } from "@chakra-ui/react";
import { useTranslation } from "@refinedev/core";

const AdminDashboard = () => {
  const { translate: t } = useTranslation();
  const { setTitle } = useLayout();
  const navigate = useNavigate();

  useEffect(() => {
    setTitle(t("admin.dashboard.title"));
  }, [setTitle, t]);

  return <Text>{t("admin.dashboard.welcome")}</Text>;
};

export default AdminDashboard;
