import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useCreate, useList } from "@refinedev/core";
import { useLayout } from "../../providers/layout-provider";
import { Box, Button, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { CreateEventRequest } from "../../features/events/events.requests";
import { Location } from "../../features/locations/location.model";

const EventCreatePage = () => {
  const { setTitle, setActions } = useLayout();
  const navigate = useNavigate();
  const { mutate: createEvent } = useCreate();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateEventRequest>();

  const { result: locations } = useList<Location>({
    resource: "locations",
  });

  useEffect(() => {
    setTitle("Create Event");
    setActions(null);
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
      }
    );
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4} align="stretch">
          <div>
            <label>Name</label>
            <input {...register("name", { required: true })} />
            {errors.name && <span>This field is required</span>}
          </div>

          <div>
            <label>Start Date</label>
            <input type="datetime-local" {...register("start_date", { required: true })} />
            {errors.start_date && <span>This field is required</span>}
          </div>

          <div>
            <label>End Date</label>
            <input type="datetime-local" {...register("end_date", { required: true })} />
            {errors.end_date && <span>This field is required</span>}
          </div>

          <div>
            <label>
              <input type="checkbox" {...register("is_public")} />
              Is Public
            </label>
          </div>

          <div>
            <label>Event Type ID (optional)</label>
            <input {...register("event_type_id")} />
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

          <Button type="submit">Create Event</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default EventCreatePage;
