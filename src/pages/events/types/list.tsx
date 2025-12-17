import { Badge, Box, HStack, IconButton, Spinner } from "@chakra-ui/react";
import {
  useDelete,
  useList,
  useNavigation,
  useTranslation,
} from "@refinedev/core";
import { LuBadgeInfo, LuPencil, LuTrash2 } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router";
import { DataTable } from "../../../components/Common/DataTable";
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
      <DataTable
        resource="types"
        parentModule="events"
        caption={
          <Box color="red.500" display="flex" alignItems="center" gap={2}>
            <LuBadgeInfo />
            <span>{t("admin.eventTypes.translationRequired")}</span>
          </Box>
        }
        columns={[
          {
            key: "code",
            header: t("admin.eventTypes.table.code"),
            sortable: true,
          },
          {
            key: "name",
            header: (
              <>
                {t("admin.eventTypes.table.name")}
                <Badge ml={2}>{t("common.translated")}</Badge>
              </>
            ),
            render: (item: EventType) => (
              <>{t(`events.types.name.${item.code}`)}</>
            ),
          },
          {
            key: "actions",
            header: t("admin.eventTypes.table.actions"),
            textAlign: "right",
            render: (item: EventType) => (
              <HStack>
                <IconButton
                  variant="ghost"
                  aria-label="Edit Event Type"
                  rounded="full"
                  onClick={() => {
                    edit("types", item.id, "push", {
                      meta: { parentModule: "events" },
                    });
                  }}
                >
                  <LuPencil />
                </IconButton>
                <IconButton
                  color="red"
                  variant="ghost"
                  onClick={() => handleDelete(item.id)}
                  aria-label="Delete Event Type"
                  rounded="full"
                >
                  <LuTrash2 />
                </IconButton>
              </HStack>
            ),
          },
        ]}
      />
    </Box>
  );
};

export default EventTypesListPage;
