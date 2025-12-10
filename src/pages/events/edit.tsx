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
  const navigate = useNavigate();
  const { mutate: updateEvent } = useUpdate();

  const {
    result: event,
    query: { isLoading },
  } = useOne<Event>({
    resource: "events",
    id: id!,
  });

  const { result: locations } = useList<Location>({
    resource: "locations",
  });

  const { result: eventTypes } = useList<EventType>({
    resource: "types",
    meta: { parentmodule: "events" },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateEventRequest>();

  useEffect(() => {
    setTitle("Edit Event");
    setActions(<EventEditActions />);
  }, [setTitle, setActions]);

  useEffect(() => {
    if (event) {
      reset({
        name: event.name,
        start_date: event.startDate,
        end_date: event.endDate,
        is_public: event.isPublic,
        event_type_id: event.eventTypeId,
        location_id: event.locationId,
      });
    }
  }, [event, reset]);

  const onSubmit = (formData: UpdateEventRequest) => {
    updateEvent(
      {
        resource: "events",
        id: id!,
        values: formData,
      },
      {
        onSuccess: () => {
          navigate("/events");
        },
      },
    );
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!id) {
    return <div>Event not found</div>;
  }

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4} align="stretch">
          <div>
            <label>Name</label>
            <input {...register("name")} />
            {errors.name && <span>This field is required</span>}
          </div>

          <div>
            <label>Start Date</label>
            <input type="datetime-local" {...register("start_date")} />
          </div>

          <div>
            <label>End Date</label>
            <input type="datetime-local" {...register("end_date")} />
          </div>

          <div>
            <label>
              <input type="checkbox" {...register("is_public")} />
              Is Public
            </label>
          </div>

          <div>
            <label>Event Type ID (optional)</label>
            <select {...register("event_type_id")}>
              <option value="">Select a event type</option>
              {eventTypes?.data?.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.nameDe}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Location (optional)</label>
            <select {...register("location_id")}>
              <option value="">Select a location</option>
              {locations?.data?.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit">Update Event</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default EventEditPage;
