import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Separator,
  Spinner,
  Stack,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { CanAccess, useGo, useList, useTranslation } from "@refinedev/core";
import { useMemo, useState } from "react";
import { LuPencil } from "react-icons/lu";
import { Event } from "../../../features/events/events.model";
import {
  EventSession,
  Programm,
} from "../../../features/programm/programm.model";

interface ProgramProps {
  event: Event;
}

export default function Program({ event }: ProgramProps) {
  const { translate: t } = useTranslation();
  const go = useGo();
  const [selectedDay, setSelectedDay] = useState<string>("");

  const { result: sessions, query: sessionsQuery } = useList<EventSession>({
    resource: "sessions",
    meta: { parentModule: "programm" },
    filters: [
      {
        field: "eventId",
        operator: "eq",
        value: event.id,
      },
    ],
  });

  const sessionIds = sessions?.data?.map((session) => session.id) ?? [];

  const { result: programms, query: programmsQuery } = useList<Programm>({
    resource: "programm",
    filters:
      sessionIds.length > 0
        ? [
            {
              field: "sessionId",
              operator: "eq",
              value: sessionIds,
            },
          ]
        : undefined,
    queryOptions: {
      enabled: sessionIds.length > 0,
    },
  });

  // Get days that have sessions (sorted chronologically)
  const daysWithSessions = useMemo(() => {
    if (!sessions?.data) return [];
    return [
      ...new Set(
        sessions.data.map(
          (s) => new Date(s.startTime).toISOString().split("T")[0],
        ),
      ),
    ].sort();
  }, [sessions]);

  // Set initial selected day
  useMemo(() => {
    if (!selectedDay && daysWithSessions.length > 0) {
      setSelectedDay(daysWithSessions[0]);
    }
  }, [selectedDay, daysWithSessions]);

  // Filter sessions by selected day
  const sessionsForDay = useMemo(() => {
    if (!selectedDay || !sessions?.data) return sessions?.data || [];
    return sessions.data.filter(
      (s) => new Date(s.startTime).toISOString().split("T")[0] === selectedDay,
    );
  }, [sessions, selectedDay]);

  const grouped = useMemo(() => {
    const map = new Map<string, Programm[]>();
    programms?.data?.forEach((item) => {
      if (!map.has(item.sessionId)) {
        map.set(item.sessionId, []);
      }
      map.get(item.sessionId)?.push(item);
    });

    // sort items in each session by start time
    map.forEach((list) =>
      list.sort((a, b) => a.startTime.getTime() - b.startTime.getTime()),
    );

    return map;
  }, [programms]);

  if (sessionsQuery.isLoading || programmsQuery.isLoading) {
    return (
      <Flex align="center" justify="center" py={8}>
        <Spinner />
      </Flex>
    );
  }

  if (!sessions?.data?.length) {
    return (
      <Stack gap={4} align="start">
        <Heading size="sm">{t("events.messages.noProgram")}</Heading>
        <CanAccess resource="programm" action="create">
          <Button
            colorPalette="blue"
            onClick={() => {
              go({
                to: `/admin/events/${event.id}/programm`,
                type: "replace",
              });
            }}
          >
            {t("events.programm.actions.addProgramm")}
          </Button>
        </CanAccess>
      </Stack>
    );
  }

  return (
    <Stack gap={6}>
      {daysWithSessions.length > 0 && (
        <Tabs.Root
          value={selectedDay}
          onValueChange={(e) => setSelectedDay(e.value)}
        >
          <Tabs.List>
            {daysWithSessions.map((day) => (
              <Tabs.Trigger key={day} value={day}>
                {new Date(day).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content value={selectedDay}>
            <Stack gap={6} mt={4}>
              {sessionsForDay.map((session) => {
                const items = grouped.get(session.id) ?? [];
                return (
                  <Box
                    key={session.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                      mb={2}
                      wrap="wrap"
                    >
                      <Box>
                        <Flex align="center" gap={4}>
                          <Heading size="md">{session.name}</Heading>
                          <CanAccess resource="programm" action="update">
                            <IconButton
                              aria-label="Edit programm"
                              size="xs"
                              variant="ghost"
                              onClick={() =>
                                go({
                                  to: `/admin/events/${event.id}/programm?editSession=${session.id}`,
                                  type: "replace",
                                })
                              }
                            >
                              <LuPencil />
                            </IconButton>
                          </CanAccess>
                        </Flex>
                        <Text color="gray.600">
                          {session.startTime.toLocaleString()} —{" "}
                          {session.endTime.toLocaleString()}
                        </Text>
                      </Box>
                      <Badge colorScheme="purple">{items.length} items</Badge>
                    </Flex>
                    <Separator mb={3} />
                    <Stack gap={3}>
                      {items.length === 0 && (
                        <Text color="gray.500">
                          {t("events.messages.noProgramItems")}
                        </Text>
                      )}
                      {items.map((item) => (
                        <Box
                          key={item.id}
                          p={3}
                          borderWidth="1px"
                          borderRadius="md"
                        >
                          <Flex justify="space-between" align="center" mb={1}>
                            <Flex align="center" gap={2}>
                              <Heading size="sm">{item.title}</Heading>
                              <Badge>
                                {t(`events.programm.types.${item.type}`)}
                              </Badge>
                            </Flex>
                            <CanAccess resource="programm" action="update">
                              <IconButton
                                aria-label="Edit programm"
                                size="xs"
                                variant="ghost"
                                onClick={() =>
                                  go({
                                    to: `/admin/events/${event.id}/programm?editProgramm=${item.id}`,
                                    type: "replace",
                                  })
                                }
                              >
                                <LuPencil />
                              </IconButton>
                            </CanAccess>
                          </Flex>
                          <Text color="gray.600" fontSize="sm">
                            {item.startTime.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {" - "}
                            {item.endTime.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
                          {item.description && (
                            <Text mt={2} fontSize="sm">
                              {item.description}
                            </Text>
                          )}
                          <Flex gap={4} mt={2} wrap="wrap">
                            {item.level && (
                              <Badge colorScheme="blue" variant="subtle">
                                {item.level}
                              </Badge>
                            )}
                            {item.isFeatured && (
                              <Badge colorScheme="green" variant="solid">
                                {t("events.labels.featured")}
                              </Badge>
                            )}
                            {item.tags && (
                              <Badge colorScheme="gray" variant="outline">
                                {item.tags}
                              </Badge>
                            )}
                          </Flex>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          </Tabs.Content>
        </Tabs.Root>
      )}
    </Stack>
  );
}
