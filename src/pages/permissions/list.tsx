import { useEffect } from "react";
import { useLayout } from "../../providers/layout-provider";
import { useList, useNavigation } from "@refinedev/core";
import { Box, Button, Table } from "@chakra-ui/react";
import { Permission } from "../../features/permissions/permissions.model";
import { Permissions } from "../../components/Admin/Permissions";

const PermissionsListActions = () => {
  const { create } = useNavigation();
  return (
    <Button onClick={() => create("permissions")}>Create Permission</Button>
  );
};

const PermissionsListPage = () => {
  const { setTitle, setActions } = useLayout();
  const { edit, show } = useNavigation();
  const {
    query: { isLoading },
    result,
  } = useList<Permission>({
    resource: "permissions",
  });

  useEffect(() => {
    setTitle("Permissions");
    setActions(<PermissionsListActions />);
  }, [setTitle, setActions]);

  if (isLoading) return <Box>Loading...</Box>;

  return <Permissions />;
};

export default PermissionsListPage;
