import {
  Box,
  Button,
  Card,
  HStack,
  IconButton,
  Separator,
  Stack,
  Tabs,
  Text,
  Timeline,
  VStack,
} from "@chakra-ui/react";
import {
  CanAccess,
  useCan,
  useCreate,
  useList,
  useNavigation,
  useOne,
  useUpdate,
} from "@refinedev/core";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuCheck, LuPencil, LuPlus, LuX } from "react-icons/lu";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ProgrammForm } from "../../components/Events/Sessions/ProgrammForm";
import { SessionForm } from "../../components/Events/Sessions/SessionForm";
import {
  EventSession,
  Programm,
  ProgrammType,
} from "../../features/programm/programm.model";
import { useLayout } from "../../providers/layout-provider";

interface ProgrammFormValues {
  title: string;
  description?: string;
  type: ProgrammType;
  start_time: string;
  end_time: string;
}

interface SessionFormValues {
  name: string;
  date: string;
  start_time: string;
  end_time: string;
}

type InsertPosition =
  | {
      type: "programm";
      sessionId: string;
      afterProgrammId?: string;
    }
  | {
      type: "session";
      afterSessionId?: string;
    };

// Hover-triggered separator with plus button
const AddItemSeparator = ({
  label,
  onClick,
  size = "sm",
  ml,
}: {
  label: string;
  onClick: () => void;
  size?: "xs" | "sm";
  ml?: string | number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      position="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ml={ml}
      transform={isHovered ? "scale(1)" : "scale(0.2)"}
      transition="transform 0.3s cubic-bezier(0.1, 0, 0.2, 1)"
    >
      <HStack
        justify="center"
        gap={2}
        align="center"
        transform={isHovered ? "scaleY(1)" : "scaleY(0.3)"}
        transition="transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      >
        <Box
          flex="1"
          maxWidth={isHovered ? "100%" : "0"}
          transition="max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          overflow="hidden"
        >
          <Separator />
        </Box>
        <Box
          opacity={isHovered ? 1 : 0}
          transition="all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
        >
          <IconButton
            aria-label={label}
            size={size === "xs" ? "2xs" : "xs"}
            transform={isHovered ? "rotate(0deg)" : "rotate(-90deg)"}
            transition="transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            variant="solid"
            onClick={onClick}
          >
            <LuPlus />
          </IconButton>
        </Box>
        <Box
          flex="1"
          maxWidth={isHovered ? "100%" : "0"}
          transition="max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          overflow="hidden"
        >
          <Separator />
        </Box>
      </HStack>
    </Box>
  );
};

// Component to add a new programm item inline
const InlineProgrammForm = ({
  sessionId,
  onSave,
  onCancel,
}: {
  sessionId: string;
  onSave: (data: ProgrammFormValues & { session_id: string }) => void;
  onCancel: () => void;
}) => {
  return (
    <ProgrammForm
      sessionId={sessionId}
      onSave={onSave}
      onCancel={onCancel}
      isInline={true}
    />
  );
};

// Component to add a new session inline
const InlineSessionForm = ({
  eventId,
  availableDates,
  selectedDate,
  onSave,
  onCancel,
}: {
  eventId: string;
  availableDates: string[];
  selectedDate?: string;
  onSave: (data: SessionFormValues & { event_id: string }) => void;
  onCancel: () => void;
}) => {
  return (
    <SessionForm
      eventId={eventId}
      availableDates={availableDates}
      selectedDate={selectedDate}
      onSave={onSave}
      onCancel={onCancel}
      isInline={true}
    />
  );
};

const ProgrammsListPage = () => {
  const navigate = useNavigate();
  const { edit } = useNavigation();
  const { t } = useTranslation();
  const { setTitle, setActions } = useLayout();
  const { eventId } = useParams<{ eventId: string }>();
  const [searchParams] = useSearchParams();
  
  const editSessionId = searchParams.get("editSession");
  const editProgrammId = searchParams.get("editProgramm");

  const [insertPosition, setInsertPosition] = useState<InsertPosition | null>(
    null,
  );
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [editingSessionId, setEditingSessionId] = useState<string | null>(editSessionId);
  const [editingProgrammId, setEditingProgrammId] = useState<string | null>(editProgrammId);

  // Fetch event details
  const { result: event } = useOne({
    resource: "events",
    id: eventId,
    queryOptions: { enabled: Boolean(eventId) },
  });

  // Fetch sessions for this event
  const {
    result: sessionsResult,
    query: { refetch: refetchSessions },
  } = useList<EventSession>({
    resource: "sessions",
    meta: { parentModule: "programm" },
    filters: eventId
      ? [{ field: "event_id", operator: "eq", value: eventId }]
      : [],
    sorters: [{ field: "start_time", order: "asc" }],
  });

  // Fetch all programms
  const {
    result: programmsResult,
    query: { refetch: refetchProgramms },
  } = useList<Programm>({
    resource: "programm",
    pagination: { mode: "off" },
    sorters: [{ field: "start_time", order: "asc" }],
  });

  // Create mutations
  const { mutate: createSession } = useCreate();
  const { mutate: createProgramm } = useCreate();
  
  // Update mutations
  const { mutate: updateSession } = useUpdate();
  const { mutate: updateProgramm } = useUpdate();

  // Check permissions
  const { data: canCreateSession } = useCan({
    resource: "eventsessions",
    action: "create",
  });
  const { data: canCreateProgramm } = useCan({
    resource: "programm",
    action: "create",
  });

  useEffect(() => {
    setTitle(t("events.tabs.program"));
    setActions(null);
  }, [setTitle, setActions, t]);

  const sessions = sessionsResult?.data || [];
  const allProgramms = programmsResult?.data || [];

  // Calculate all days between event start and end
  const eventDays = useMemo(() => {
    if (!event?.startDate || !event?.endDate) return [];

    const days: string[] = [];
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d).toISOString().split("T")[0]);
    }

    return days;
  }, [event]);

  // Get days that already have sessions (sorted chronologically)
  const daysWithSessions = useMemo(() => {
    return [
      ...new Set(
        sessions.map((s) => new Date(s.startTime).toISOString().split("T")[0]),
      ),
    ].sort();
  }, [sessions]);

  // Get available dates for new sessions (days without sessions yet)
  const availableDates = useMemo(() => {
    return eventDays.filter((day) => !daysWithSessions.includes(day));
  }, [eventDays, daysWithSessions]);

  // Get available dates including current selected day (for adding multiple sessions to same day)
  const availableDatesWithCurrent = useMemo(() => {
    if (!selectedDay) return availableDates;
    if (availableDates.includes(selectedDay)) return availableDates;
    return [selectedDay, ...availableDates].sort();
  }, [availableDates, selectedDay]);

  // Set initial selected day or jump to day with editing item
  useEffect(() => {
    // If editing a session, find its day and select it
    if (editSessionId && sessions.length > 0) {
      const sessionToEdit = sessions.find(s => s.id === editSessionId);
      if (sessionToEdit) {
        const sessionDay = new Date(sessionToEdit.startTime).toISOString().split("T")[0];
        setSelectedDay(sessionDay);
        setEditingSessionId(editSessionId);
        return;
      }
    }
    
    // If editing a programm, find its session's day and select it
    if (editProgrammId && allProgramms.length > 0) {
      const programmToEdit = allProgramms.find(p => p.id === editProgrammId);
      if (programmToEdit) {
        const session = sessions.find(s => s.id === programmToEdit.sessionId);
        if (session) {
          const sessionDay = new Date(session.startTime).toISOString().split("T")[0];
          setSelectedDay(sessionDay);
          setEditingProgrammId(editProgrammId);
          return;
        }
      }
    }
    
    // Default: select first day with sessions or first event day
    if (!selectedDay && daysWithSessions.length > 0) {
      setSelectedDay(daysWithSessions[0]);
    } else if (!selectedDay && eventDays.length > 0) {
      setSelectedDay(eventDays[0]);
    }
  }, [selectedDay, daysWithSessions, eventDays, editSessionId, editProgrammId, sessions, allProgramms]);

  // Filter sessions by selected day
  const sessionsForDay = useMemo(() => {
    if (!selectedDay) return sessions;
    return sessions.filter(
      (s) => new Date(s.startTime).toISOString().split("T")[0] === selectedDay,
    );
  }, [sessions, selectedDay]);

  // Group programms by session
  const programmsBySession = sessions.reduce(
    (acc: Record<string, Programm[]>, session: EventSession) => {
      acc[session.id] = allProgramms.filter(
        (p: Programm) => p.sessionId === session.id,
      );
      return acc;
    },
    {} as Record<string, Programm[]>,
  );

  const handleSaveSession = (
    data: SessionFormValues & { event_id: string },
  ) => {
    // Combine date and time into ISO string
    const startTime = `${data.date}T${data.start_time}:00`;
    const endTime = `${data.date}T${data.end_time}:00`;

    createSession(
      {
        resource: "sessions",
        values: {
          name: data.name,
          start_time: startTime,
          end_time: endTime,
          event_id: data.event_id,
        },
        meta: { parentModule: "programm" },
      },
      {
        onSuccess: () => {
          refetchSessions();
          setInsertPosition(null);
        },
      },
    );
  };

  const handleSaveProgramm = (
    data: ProgrammFormValues & { session_id: string },
  ) => {
    // Find the session to get its date
    const session = sessions.find((s) => s.id === data.session_id);
    const sessionDate = session
      ? new Date(session.startTime).toISOString().split("T")[0]
      : selectedDay;

    // Combine date and time into ISO string
    const startTime = `${sessionDate}T${data.start_time}:00`;
    const endTime = `${sessionDate}T${data.end_time}:00`;

    createProgramm(
      {
        resource: "programm",
        values: {
          title: data.title,
          description: data.description,
          type: data.type,
          start_time: startTime,
          end_time: endTime,
          session_id: data.session_id,
          is_featured: false,
        },
      },
      {
        onSuccess: () => {
          refetchProgramms();
          setInsertPosition(null);
        },
      },
    );
  };

  const handleUpdateSession = (
    sessionId: string,
    data: SessionFormValues & { event_id: string },
  ) => {
    // Combine date and time
    const startTime = `${data.date}T${data.start_time}:00`;
    const endTime = `${data.date}T${data.end_time}:00`;

    updateSession(
      {
        resource: "sessions",
        id: sessionId,
        values: {
          name: data.name,
          start_time: startTime,
          end_time: endTime,
          event_id: data.event_id,
        },
        meta: { parentModule: "programm" },
      },
      {
        onSuccess: () => {
          refetchSessions();
          setEditingSessionId(null);
          navigate(`/admin/events/${eventId}/programm`, { replace: true });
        },
      },
    );
  };

  const handleUpdateProgramm = (
    programmId: string,
    data: ProgrammFormValues & { session_id: string },
  ) => {
    // Find the session to get its date
    const session = sessions.find((s) => s.id === data.session_id);
    const sessionDate = session
      ? new Date(session.startTime).toISOString().split("T")[0]
      : selectedDay;

    // Combine date and time into ISO string
    const startTime = `${sessionDate}T${data.start_time}:00`;
    const endTime = `${sessionDate}T${data.end_time}:00`;

    updateProgramm(
      {
        resource: "programm",
        id: programmId,
        values: {
          title: data.title,
          description: data.description,
          type: data.type,
          start_time: startTime,
          end_time: endTime,
          session_id: data.session_id,
        },
      },
      {
        onSuccess: () => {
          refetchProgramms();
          setEditingProgrammId(null);
          navigate(`/admin/events/${eventId}/programm`, { replace: true });
        },
      },
    );
  };

  if (!eventId) {
    return (
      <Box p={8}>
        <Text>
          No event selected. Please select an event to view its program.
        </Text>
      </Box>
    );
  }

  return (
    <VStack align="stretch" gap={6} p={4}>
      {/* Event info */}
      {event && (
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            {event.name}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {new Date(event.startDate).toLocaleDateString()} -{" "}
            {new Date(event.endDate).toLocaleDateString()}
          </Text>
        </Box>
      )}

      {/* Day Tabs */}
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
          {availableDates.length > 0 && canCreateSession?.can && (
            <Tabs.Trigger
              value="new"
              onClick={() => {
                setInsertPosition({
                  type: "session",
                  afterSessionId: undefined,
                });
                setSelectedDay(availableDates[0]);
              }}
            >
              <LuPlus />
            </Tabs.Trigger>
          )}
        </Tabs.List>

        <Tabs.Content value={selectedDay}>
          {/* Timeline */}
          <Timeline.Root>
            {sessionsForDay.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Text color="gray.500" mb={4}>
                  {t("events.messages.noSessions")}
                </Text>
                {canCreateSession?.can && (
                  <>
                    {insertPosition?.type === "session" &&
                    insertPosition.afterSessionId === undefined ? (
                      <InlineSessionForm
                        eventId={eventId}
                        availableDates={availableDatesWithCurrent}
                        selectedDate={selectedDay}
                        onSave={handleSaveSession}
                        onCancel={() => setInsertPosition(null)}
                      />
                    ) : (
                      <Button
                        colorPalette="blue"
                        onClick={() =>
                          setInsertPosition({
                            type: "session",
                            afterSessionId: undefined,
                          })
                        }
                      >
                        <LuPlus /> {t("events.programm.actions.addSession")}
                      </Button>
                    )}
                  </>
                )}
              </Box>
            ) : (
              sessionsForDay.map(
                (session: EventSession, sessionIndex: number) => (
                  <Box key={session.id}>
                    {/* Add session button above */}
                    {canCreateSession?.can && (
                      <>
                        {insertPosition?.type === "session" &&
                        insertPosition.afterSessionId ===
                          (sessionIndex > 0
                            ? sessions[sessionIndex - 1].id
                            : undefined) ? (
                          <Box mb={4}>
                            <InlineSessionForm
                              eventId={eventId}
                              availableDates={availableDatesWithCurrent}
                              selectedDate={selectedDay}
                              onSave={handleSaveSession}
                              onCancel={() => setInsertPosition(null)}
                            />
                          </Box>
                        ) : (
                          <AddItemSeparator
                            label={t("events.programm.actions.addSession")}
                            ml={4}
                            onClick={() =>
                              setInsertPosition({
                                type: "session",
                                afterSessionId:
                                  sessionIndex > 0
                                    ? sessions[sessionIndex - 1].id
                                    : undefined,
                              })
                            }
                          />
                        )}
                      </>
                    )}

                    {/* Session Card */}
                    <Timeline.Item>
                      <Timeline.Indicator />
                      <Timeline.Content>
                        {editingSessionId === session.id ? (
                          <Box mb={4}>
                            <SessionForm
                              eventId={eventId}
                              session={session}
                              availableDates={availableDatesWithCurrent}
                              onSave={(data) => {
                                handleUpdateSession(session.id, data);
                              }}
                              onCancel={() => {
                                setEditingSessionId(null);
                                navigate(`/admin/events/${eventId}/programm`, { replace: true });
                              }}
                              isInline={true}
                            />
                          </Box>
                        ) : (
                          <Card.Root mb={4}>
                            <Card.Header>
                              <HStack justify="space-between" align="start">
                                <Box flex="1">
                                  <Card.Title>{session.name}</Card.Title>
                                  <Card.Description>
                                    {new Date(session.startTime).toLocaleString()} -{" "}
                                    {new Date(session.endTime).toLocaleString()}
                                  </Card.Description>
                                </Box>
                                <CanAccess resource="sessions" action="update">
                                  <IconButton
                                    aria-label={t("actions.edit")}
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingSessionId(session.id)}
                                  >
                                    <LuPencil />
                                  </IconButton>
                                </CanAccess>
                              </HStack>
                            </Card.Header>
                            <Card.Body>
                            <VStack align="stretch" gap={2}>
                              {programmsBySession[session.id]?.map(
                                (programm: Programm, programmIndex: number) => (
                                  <Box key={programm.id}>
                                    {/* Add programm button */}
                                    {canCreateProgramm?.can && (
                                      <Box ml={4}>
                                        {insertPosition?.type === "programm" &&
                                        insertPosition.sessionId ===
                                          session.id &&
                                        insertPosition.afterProgrammId ===
                                          (programmIndex > 0
                                            ? programmsBySession[session.id][
                                                programmIndex - 1
                                              ].id
                                            : undefined) ? (
                                          <Box mb={2}>
                                            <InlineProgrammForm
                                              sessionId={session.id}
                                              onSave={handleSaveProgramm}
                                              onCancel={() =>
                                                setInsertPosition(null)
                                              }
                                            />
                                          </Box>
                                        ) : (
                                          <AddItemSeparator
                                            label={t(
                                              "events.programm.actions.addProgramm",
                                            )}
                                            size="xs"
                                            onClick={() =>
                                              setInsertPosition({
                                                type: "programm",
                                                sessionId: session.id,
                                                afterProgrammId:
                                                  programmIndex > 0
                                                    ? programmsBySession[
                                                        session.id
                                                      ][programmIndex - 1].id
                                                    : undefined,
                                              })
                                            }
                                          />
                                        )}
                                      </Box>
                                    )}

                                    {/* Programm Item */}
                                    {editingProgrammId === programm.id ? (
                                      <Box mb={2} ml={4}>
                                        <ProgrammForm
                                          sessionId={session.id}
                                          programm={programm}
                                          onSave={(data) => {
                                            handleUpdateProgramm(programm.id, data);
                                          }}
                                          onCancel={() => {
                                            setEditingProgrammId(null);
                                            navigate(`/admin/events/${eventId}/programm`, { replace: true });
                                          }}
                                          isInline={true}
                                        />
                                      </Box>
                                    ) : (
                                      <HStack
                                        p={3}
                                        bg="gray.50"
                                        borderRadius="md"
                                        borderLeft="3px solid"
                                        borderColor="blue.400"
                                        ml={4}
                                      >
                                        <VStack align="start" flex={1} gap={1}>
                                          <HStack>
                                            <Text fontWeight="semibold">
                                              {programm.title}
                                            </Text>
                                            <Text fontSize="xs" color="gray.600">
                                              (
                                              {t(
                                                `events.programm.types.${programm.type}`,
                                              )}
                                              )
                                            </Text>
                                          </HStack>
                                          {programm.description && (
                                            <Text fontSize="sm" color="gray.600">
                                              {programm.description}
                                            </Text>
                                          )}
                                          <Text fontSize="xs" color="gray.500">
                                            {new Date(
                                              programm.startTime,
                                            ).toLocaleTimeString()}{" "}
                                            -{" "}
                                            {new Date(
                                              programm.endTime,
                                            ).toLocaleTimeString()}
                                          </Text>
                                        </VStack>
                                        <CanAccess
                                          resource="programm"
                                          action="update"
                                        >
                                          <IconButton
                                            aria-label="Edit programm"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setEditingProgrammId(programm.id)}
                                          >
                                            <LuPencil />
                                          </IconButton>
                                        </CanAccess>
                                      </HStack>
                                    )}
                                  </Box>
                                ),
                              )}

                              {/* Add programm button at end */}
                              {canCreateProgramm?.can && (
                                <Box ml={4}>
                                  {insertPosition?.type === "programm" &&
                                  insertPosition.sessionId === session.id &&
                                  insertPosition.afterProgrammId ===
                                    (programmsBySession[session.id]?.length > 0
                                      ? programmsBySession[session.id][
                                          programmsBySession[session.id]
                                            .length - 1
                                        ].id
                                      : undefined) ? (
                                    <Box mb={2}>
                                      <InlineProgrammForm
                                        sessionId={session.id}
                                        onSave={handleSaveProgramm}
                                        onCancel={() => setInsertPosition(null)}
                                      />
                                    </Box>
                                  ) : (
                                    <AddItemSeparator
                                      label={t(
                                        "events.programm.actions.addProgramm",
                                      )}
                                      size="xs"
                                      onClick={() =>
                                        setInsertPosition({
                                          type: "programm",
                                          sessionId: session.id,
                                          afterProgrammId:
                                            programmsBySession[session.id]
                                              ?.length > 0
                                              ? programmsBySession[session.id][
                                                  programmsBySession[session.id]
                                                    .length - 1
                                                ].id
                                              : undefined,
                                        })
                                      }
                                    />
                                  )}
                                </Box>
                              )}
                            </VStack>
                          </Card.Body>
                        </Card.Root>
                        )}
                      </Timeline.Content>
                    </Timeline.Item>
                  </Box>
                ),
              )
            )}

            {/* Add session button at end */}
            {sessions.length > 0 && canCreateSession?.can && (
              <>
                {insertPosition?.type === "session" &&
                insertPosition.afterSessionId ===
                  (sessions.length > 0
                    ? sessions[sessions.length - 1].id
                    : undefined) ? (
                  <Box mt={4}>
                    <InlineSessionForm
                      eventId={eventId}
                      availableDates={availableDatesWithCurrent}
                      selectedDate={selectedDay}
                      onSave={handleSaveSession}
                      onCancel={() => setInsertPosition(null)}
                    />
                  </Box>
                ) : (
                  <AddItemSeparator
                    label={t("events.programm.actions.addSession")}
                    ml={4}
                    onClick={() =>
                      setInsertPosition({
                        type: "session",
                        afterSessionId:
                          sessions.length > 0
                            ? sessions[sessions.length - 1].id
                            : undefined,
                      })
                    }
                  />
                )}
              </>
            )}
          </Timeline.Root>
        </Tabs.Content>
      </Tabs.Root>
    </VStack>
  );
};

export default ProgrammsListPage;
