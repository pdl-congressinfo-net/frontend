import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useLayout } from "../../providers/layout-provider";
import { Text } from "@chakra-ui/react";

const AdminDashboard = () => {
  const { setTitle } = useLayout();
  const navigate = useNavigate();

  useEffect(() => {
    setTitle("Admin Dashboard");
  }, [setTitle]);

  return <Text>Welcome to the Admin Dashboard</Text>;
};

export default AdminDashboard;
