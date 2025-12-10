import { useEffect } from "react";
import { AdminTemp } from "../../components/Admin/AdminTemp";
import { useLayout } from "../../providers/layout-provider";

const AdminTempPage = () => {
  const { setTitle, setActions } = useLayout();

  useEffect(() => {
    setTitle("Temporary Admin Page");
    setActions(null);
  }, [setTitle, setActions]);
  return <AdminTemp />;
};

export default AdminTempPage;
