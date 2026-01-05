import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate, useParams } from "react-router";
import Upsert from "../../components/Events/Upsert/Upsert";
import { useLayout } from "../../providers/layout-provider";

const EventEditActions = () => {
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate("/events")} variant="ghost">
      <LuArrowLeft />
      Back to Events
    </Button>
  );
};

const EventEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { setTitle, setActions } = useLayout();

  useEffect(() => {
    setTitle("Edit Event");
    setActions(<EventEditActions />);
  }, [setTitle, setActions]);

  if (!id) {
    return <div>Event not found</div>;
  }

  return <Upsert eventId={id} mode="edit" />;
};

export default EventEditPage;
