import { Button } from "@chakra-ui/react";
import { useCreate, useList } from "@refinedev/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router";
import Upsert from "../../components/Events/Upsert/Upsert";
import { EventType } from "../../features/events/events.model";
import { CreateEventRequest } from "../../features/events/events.requests";
import { Location } from "../../features/locations/location.model";
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
