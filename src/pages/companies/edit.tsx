import { Button } from "@chakra-ui/react";
import { useNavigation } from "@refinedev/core";
import { useEffect } from "react";
import { LuArrowLeft } from "react-icons/lu";
import CompanyEdit from "../../components/Companies/CompanyEdit";
import { useLayout } from "../../providers/layout-provider";

const CompanyEditActions = () => {
  const { list } = useNavigation();

  return (
    <Button onClick={() => list("companies")} variant="ghost">
      <LuArrowLeft />
      Back to Companies
    </Button>
  );
};

const CompanyEditPage = () => {
  const { setTitle, setActions } = useLayout();

  useEffect(() => {
    setTitle("Edit Company");
    setActions(<CompanyEditActions />);
  }, [setTitle, setActions]);

  return <CompanyEdit />;
};

export default CompanyEditPage;
