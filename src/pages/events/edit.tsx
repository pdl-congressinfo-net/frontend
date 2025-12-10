import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useOne, useUpdate, useList } from "@refinedev/core";
import { useLayout } from "../../providers/layout-provider";
import { Box, Button, VStack, Spinner } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { UpdateEventRequest } from "../../features/events/events.requests";
import { Event, EventType } from "../../features/events/events.model";
import { Location } from "../../features/locations/location.model";
import { LuArrowLeft } from "react-icons/lu";
import Upsert from "../../components/Events/Upsert/Upsert";

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
