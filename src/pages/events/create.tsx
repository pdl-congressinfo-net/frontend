import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router";
import Upsert from "../../components/Events/Upsert/Upsert";
import { useLayout } from "../../providers/layout-provider";

const EventCreateActions = () => {
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate("/events")} variant="ghost">
      <LuArrowLeft />
      Back to Events
    </Button>
  );
};

const EventCreatePage = () => {
  const { setTitle, setActions } = useLayout();

  useEffect(() => {
    setTitle("Create Event");
    setActions(<EventCreateActions />);
  }, [setTitle, setActions]);

  return <Upsert mode="create" />;
};

export default EventCreatePage;
