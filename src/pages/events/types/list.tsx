import { Badge, Box, Button, HStack, Spinner, Table } from "@chakra-ui/react";
import {
  useDelete,
  useList,
  useNavigation,
  useTranslation,
} from "@refinedev/core";
import { useLocation, useNavigate } from "react-router";
import { EventType } from "../../../features/events/events.model";

const EventTypesListPage = () => {
  const { translate: t } = useTranslation();
  const { create, edit, show } = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: deleteEventType } = useDelete();

  const {
    result: data,
    query: { isLoading },
  } = useList<EventType>({
    resource: "types",
    meta: {
      parentModule: "events",
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm(t("admin.eventTypes.confirmDelete"))) {
      deleteEventType({
        resource: "types",
        id,
        meta: {
          parentModule: "events",
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
            <Table.ColumnHeader>
              {t("admin.eventTypes.table.code")}
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              {t("admin.eventTypes.table.name")}
              <Badge ml={2}>Translated</Badge>
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              {t("admin.eventTypes.table.actions")}
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.data.map((eventType) => (
            <Table.Row key={eventType.id}>
              <Table.Cell>{eventType.code}</Table.Cell>
              <Table.Cell>
                {t(`events.types.name.${eventType.code}`)}
              </Table.Cell>
              <Table.Cell>
                <HStack>
                  <Button
                    size="sm"
                    onClick={() =>
                      show("types", eventType.id, "push", {
                        meta: { parentModule: "events" },
                      })
                    }
                  >
                    {t("common.actions.view")}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      edit("types", eventType.id, "push", {
                        meta: { parentModule: "events" },
                      });
                    }}
                  >
                    {t("common.actions.edit")}
                  </Button>
                  <Button
                    size="sm"
                    colorPalette="red"
                    onClick={() => handleDelete(eventType.id)}
                  >
                    {t("common.actions.delete")}
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
