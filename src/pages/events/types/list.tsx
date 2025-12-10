import { useEffect } from "react";
import { useList, useDelete } from "@refinedev/core";
import { useNavigate, useLocation } from "react-router";
import { useLayout } from "../../../providers/layout-provider";
import { Box, Button, Table, Spinner, HStack } from "@chakra-ui/react";
import { EventType } from "../../../features/events/events.model";
import { ApiResponse } from "../../../common/types/api";

const EventTypesListPage = () => {
  const { setTitle, setActions } = useLayout();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: deleteEventType } = useDelete();

  const { result: data, isLoading } = useList<EventType>({
    resource: "types",
    meta: {
      parentmodule: "events",
    },
  });

  useEffect(() => {
    setTitle("Event Types");
    setActions(
      <Button onClick={() => navigate("/events/types/create")}>
        Create Event Type
      </Button>
    );
  }, [setTitle, setActions, navigate]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this event type?")) {
      deleteEventType({
        resource: "eventtypes",
        id,
        meta: {
          parentmodule: "events",
        },
      });
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Box p={4}>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Code</Table.ColumnHeader>
            <Table.ColumnHeader>Name (DE)</Table.ColumnHeader>
            <Table.ColumnHeader>Name (EN)</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.data.map((eventType) => (
            <Table.Row key={eventType.id}>
              <Table.Cell>{eventType.code}</Table.Cell>
              <Table.Cell>{eventType.nameDe}</Table.Cell>
              <Table.Cell>{eventType.nameEn}</Table.Cell>
              <Table.Cell>
                <HStack>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/events/types/show/${eventType.id}`, {
                      state: { background: location, fallback: "/events/types" }
                    })}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/events/types/edit/${eventType.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    colorPalette="red"
                    onClick={() => handleDelete(eventType.id)}
                  >
                    Delete
                  </Button>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default EventTypesListPage;
