import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router";
import CompanyCreate from "../../components/Companies/CompanieCreate";
import { useLayout } from "../../providers/layout-provider";

const CompanyCreateActions = () => {
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate("/companies")} variant="ghost">
      <LuArrowLeft />
      Back to Companies
    </Button>
  );
};

const CompanyCreatePage = () => {
  const { setTitle, setActions } = useLayout();

  useEffect(() => {
    setTitle("Create Company");
    setActions(<CompanyCreateActions />);
  }, [setTitle, setActions]);

  return <CompanyCreate />;
};

export default CompanyCreatePage;
