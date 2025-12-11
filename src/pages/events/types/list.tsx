import { useEffect } from "react";
import { useList, useDelete, useTranslation } from "@refinedev/core";
import { useNavigate, useLocation } from "react-router";
import { useLayout } from "../../../providers/layout-provider";
import { Box, Button, Table, Spinner, HStack } from "@chakra-ui/react";
import { EventType } from "../../../features/events/events.model";
import { ApiResponse } from "../../../common/types/api";

const EventTypesListPage = () => {
  const { translate: t } = useTranslation();
  const { setTitle, setActions } = useLayout();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: deleteEventType } = useDelete();

  const {
    result: data,
    query: { isLoading },
  } = useList<EventType>({
    resource: "types",
    meta: {
      parentmodule: "events",
    },
  });

  useEffect(() => {
    setTitle(t("admin.eventTypes.title"));
    setActions(
      <Button onClick={() => navigate("/events/types/create")}>
        {t("admin.eventTypes.actions.create")}
      </Button>,
    );
  }, [setTitle, setActions, navigate, t]);

  const handleDelete = (id: string) => {
    if (window.confirm(t("admin.eventTypes.confirmDelete"))) {
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
            <Table.ColumnHeader>{t("admin.eventTypes.table.code")}</Table.ColumnHeader>
            <Table.ColumnHeader>{t("admin.eventTypes.table.nameDe")}</Table.ColumnHeader>
            <Table.ColumnHeader>{t("admin.eventTypes.table.nameEn")}</Table.ColumnHeader>
            <Table.ColumnHeader>{t("admin.eventTypes.table.actions")}</Table.ColumnHeader>
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
                    onClick={() =>
                      navigate(`/events/types/show/${eventType.id}`, {
                        state: {
                          background: location,
                          fallback: "/events/types",
                        },
                      })
                    }
                  >
                    {t("common.actions.view")}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate(`/events/types/edit/${eventType.id}`)
                    }
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
