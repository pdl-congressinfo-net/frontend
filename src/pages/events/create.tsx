import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useCreate, useList } from "@refinedev/core";
import { useLayout } from "../../providers/layout-provider";
import { Box, Button, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { CreateEventRequest } from "../../features/events/events.requests";
import { Location } from "../../features/locations/location.model";
import { LuArrowLeft } from "react-icons/lu";
import { EventType } from "../../features/events/events.model";
import Upsert from "../../components/Events/Upsert/Upsert";

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
  const navigate = useNavigate();
  const { mutate: createEvent } = useCreate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventRequest>();

  const { result: locations } = useList<Location>({
    resource: "locations",
  });

  const { result: eventTypes } = useList<EventType>({
    resource: "types",
    meta: { parentmodule: "events" },
  });
  useEffect(() => {
    setTitle("Create Event");
    setActions(<EventCreateActions />);
  }, [setTitle, setActions]);

  const onSubmit = (data: CreateEventRequest) => {
    createEvent(
      {
        resource: "events",
        values: data,
      },
      {
        onSuccess: () => {
          navigate("/events");
        },
      },
    );
  };

  return <Upsert mode="create" />;
};

export default EventCreatePage;
