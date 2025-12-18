import {
  Badge,
  Box,
  Flex,
  Heading,
  Separator,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useList, useTranslation } from "@refinedev/core";
import { useMemo } from "react";
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

  const sessionIds = sessions?.map((session) => session.id) ?? [];

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

  const grouped = useMemo(() => {
    const map = new Map<string, Programm[]>();
    programms?.forEach((item) => {
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

  if (!sessions?.length) {
    return <Heading size="sm">{t("events.messages.noProgram")}</Heading>;
  }

  return (
    <Stack gap={6}>
      {sessions.map((session) => {
        const items = grouped.get(session.id) ?? [];
        return (
          <Box key={session.id} p={4} borderWidth="1px" borderRadius="lg">
            <Flex justify="space-between" align="center" mb={2} wrap="wrap">
              <Box>
                <Heading size="md">{session.name}</Heading>
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
                <Box key={item.id} p={3} borderWidth="1px" borderRadius="md">
                  <Flex justify="space-between" align="center" mb={1}>
                    <Heading size="sm">{item.title}</Heading>
                    <Badge>{item.type}</Badge>
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
  );
}
