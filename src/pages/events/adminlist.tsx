import { Badge, Box, IconButton } from "@chakra-ui/react";
import {
  CanAccess,
  useCustomMutation,
  useGo,
  useList,
  useNavigation,
  useTranslation,
} from "@refinedev/core";
import { useCallback, useEffect, useState } from "react";
import {
  LuArchive,
  LuCirclePlus,
  LuClipboardList,
  LuEye,
  LuEyeOff,
  LuMapPinned,
  LuPencil,
} from "react-icons/lu";
import { useNavigate } from "react-router";
import { DataTable } from "../../components/Common/DataTable";
import { Tooltip } from "../../components/ui/tooltip";
import { Event } from "../../features/events/events.model";
import { Location } from "../../features/locations/location.model";
import { useLayout } from "../../providers/layout-provider";

const EventAdminListActions = () => {
  const navigate = useNavigate();
  const { create } = useNavigation();

  return (
    <>
      <IconButton
        onClick={() => navigate("/events/archive")}
        variant="ghost"
        rounded="full"
        aria-label="Archive Events"
        onMouseDown={(e) => e.preventDefault()}
      >
        <LuArchive />
      </IconButton>
      <IconButton
        onClick={() => create("adminEvents")}
        variant="ghost"
        rounded="full"
        aria-label="Add Event"
      >
        <LuCirclePlus />
      </IconButton>
    </>
  );
};

const EventsAdminListPage = () => {
  const { setTitle, setActions } = useLayout();
  const [eventData, setEventData] = useState<Event[]>([]);
  const [query, setQuery] = useState<any>(null);
  const { translate: t } = useTranslation();
  const { edit } = useNavigation();

  const go = useGo();

  const {
    result: { data: locations },
    query: { isLoading },
  } = useList<Location>({
    resource: "locations",
    filters:
      eventData.length > 0
        ? [
            {
              field: "id",
              operator: "in",
              value: eventData.map((event) => event.locationId),
            },
          ]
        : [],
    queryOptions: { enabled: eventData.length > 0 },
  });

  const { mutate: publishEvent } = useCustomMutation();

  useEffect(() => {
    setTitle("Events");
    setActions(<EventAdminListActions />);
  }, [setTitle, setActions]);

  const handlePublishClick = (eventId: string, shouldPublish: boolean) => {
    const endpoint = shouldPublish ? "publish" : "unpublish";
    publishEvent(
      {
        url: `events/${eventId}/${endpoint}`,
        method: "post",
        values: {},
      },
      {
        onSuccess: () => {
          query?.refetch?.();
        },
      },
    );
  };

  return (
    <Box>
      <DataTable
        resource="events"
        onDataChange={useCallback((items: Event[]) => {
          setEventData(items);
        }, [])}
        onQuery={useCallback((q) => {
          setQuery(q);
        }, [])}
        columns={[
          {
            key: "name",
            header: "Name",
            sortable: true,
            searchable: true,
            render: (item: Event) => (
              <>
                {item.name}
                {item.isPublic && <Badge>{t("events.public")}</Badge>}
              </>
            ),
          },
          {
            key: "startDate",
            header: "Date",
            sortable: true,
            render: (item: Event) => (
              <>
                {new Date(item.startDate).toLocaleDateString()}
                {" - "}
                {new Date(item.endDate).toLocaleDateString()}
              </>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            textAlign: "right",
            render: (record: Event) => {
              return (
                <>
                  <CanAccess resource="programm" action="update">
                    <Tooltip
                      openDelay={200}
                      closeDelay={0}
                      positioning={{ placement: "right" }}
                      content={t("events.programm.actions.view")}
                    >
                      <IconButton
                        size="sm"
                        onClick={() =>
                          go({ to: `/admin/events/${record.id}/programm` })
                        }
                        variant="ghost"
                        rounded="full"
                        aria-label="View Programm"
                      >
                        <LuClipboardList />
                      </IconButton>
                    </Tooltip>
                  </CanAccess>
                  <CanAccess resource="locations" action="update">
                    {record.locationId && (
                      <Tooltip
                        openDelay={200}
                        closeDelay={0}
                        positioning={{ placement: "right" }}
                        content={t("locations.form.actions.adjustLocation")}
                      >
                        <IconButton
                          size="sm"
                          onClick={() => edit("locations", record.locationId)}
                          variant="ghost"
                          rounded="full"
                          aria-label="View Location"
                        >
                          <LuMapPinned />
                        </IconButton>
                      </Tooltip>
                    )}
                  </CanAccess>
                  <CanAccess resource="events" action="publish">
                    <Tooltip
                      openDelay={200}
                      closeDelay={0}
                      positioning={{ placement: "right" }}
                      content={
                        record.isPublic
                          ? t("events.actions.unpublish")
                          : t("events.actions.publish")
                      }
                    >
                      <IconButton
                        size="sm"
                        onClick={() =>
                          handlePublishClick(record.id, !record.isPublic)
                        }
                        variant="ghost"
                        rounded="full"
                        aria-label="Publish Toggle"
                      >
                        {!record.isPublic ? <LuEye /> : <LuEyeOff />}
                      </IconButton>
                    </Tooltip>
                  </CanAccess>
                  <CanAccess resource="events" action="update">
                    <Tooltip
                      openDelay={200}
                      closeDelay={0}
                      positioning={{ placement: "right" }}
                      content={t("events.details.title")}
                    >
                      <IconButton
                        size="sm"
                        onClick={() => edit("adminEvents", record.id)}
                        variant="ghost"
                        rounded="full"
                        aria-label="View Details"
                      >
                        <LuPencil />
                      </IconButton>
                    </Tooltip>
                  </CanAccess>
                </>
              );
            },
          },
        ]}
        loading={isLoading}
      />
    </Box>
  );
};

export default EventsAdminListPage;
