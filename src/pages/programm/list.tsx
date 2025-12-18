import {
  Box,
  Button,
  Card,
  createListCollection,
  Field,
  Fieldset,
  HStack,
  IconButton,
  Input,
  Select,
  Separator,
  Stack,
  Text,
  Textarea,
  Timeline,
  VStack,
} from "@chakra-ui/react";
import { useCan, useCreate, useList, useOne } from "@refinedev/core";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuArrowLeft, LuCheck, LuPlus, LuX } from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router-dom";
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

const ProgrammsListActions = () => {
  const navigate = useNavigate();
  return (
    <Button onClick={() => navigate(-1)} variant="ghost">
      <LuArrowLeft /> Back
    </Button>
  );
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
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<ProgrammFormValues>();

  const programmTypes: ProgrammType[] = [
    "LCT",
    "WKS",
    "DMO",
    "NET",
    "BRK",
    "KEY",
    "OTH",
  ];
  const typeCollection = createListCollection({
    items: programmTypes.map((type) => ({
      label: t(`events.programm.types.${type}`),
      value: type,
    })),
  });

  const onSubmit = (data: ProgrammFormValues) => {
    onSave({ ...data, session_id: sessionId });
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      p={4}
      bg="gray.50"
      borderRadius="md"
    >
      <Fieldset.Root>
        <Stack gap={3}>
          <Field.Root required>
            <Field.Label>{t("events.programm.fields.title")}</Field.Label>
            <Input
              placeholder={t("events.programm.placeholders.enterTitle")}
              {...register("title", { required: true })}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>{t("events.programm.fields.description")}</Field.Label>
            <Textarea
              placeholder={t("events.programm.placeholders.enterDescription")}
              {...register("description")}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>{t("events.programm.fields.type")}</Field.Label>
            <Select.Root
              collection={typeCollection}
              defaultValue={["LCT"]}
              positioning={{ sameWidth: true }}
            >
              <Select.Trigger>
                <Select.ValueText
                  placeholder={t("events.programm.placeholders.selectType")}
                />
              </Select.Trigger>
              <Select.Content>
                {typeCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
              <select {...register("type", { required: true })} hidden>
                {programmTypes.map((type) => (
                  <option key={type} value={type}>
                    {t(`events.programm.types.${type}`)}
                  </option>
                ))}
              </select>
            </Select.Root>
          </Field.Root>

          <HStack gap={3}>
            <Field.Root required flex={1}>
              <Field.Label>{t("events.programm.fields.startTime")}</Field.Label>
              <Input
                type="datetime-local"
                {...register("start_time", { required: true })}
              />
            </Field.Root>

            <Field.Root required flex={1}>
              <Field.Label>{t("events.programm.fields.endTime")}</Field.Label>
              <Input
                type="datetime-local"
                {...register("end_time", { required: true })}
              />
            </Field.Root>
          </HStack>

          <HStack justify="flex-end" gap={2}>
            <Button variant="ghost" onClick={onCancel}>
              <LuX /> {t("events.programm.actions.cancel")}
            </Button>
            <Button type="submit" colorPalette="blue">
              <LuCheck /> {t("events.programm.actions.save")}
            </Button>
          </HStack>
        </Stack>
      </Fieldset.Root>
    </Box>
  );
};

// Component to add a new session inline
const InlineSessionForm = ({
  eventId,
  onSave,
  onCancel,
}: {
  eventId: string;
  onSave: (data: SessionFormValues & { event_id: string }) => void;
  onCancel: () => void;
}) => {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<SessionFormValues>();

  const onSubmit = (data: SessionFormValues) => {
    onSave({ ...data, event_id: eventId });
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      p={4}
      bg="blue.50"
      borderRadius="md"
    >
      <Fieldset.Root>
        <Stack gap={3}>
          <Field.Root required>
            <Field.Label>{t("events.programm.fields.sessionName")}</Field.Label>
            <Input
              placeholder={t("events.programm.placeholders.enterTitle")}
              {...register("name", { required: true })}
            />
          </Field.Root>

          <HStack gap={3}>
            <Field.Root required flex={1}>
              <Field.Label>{t("events.programm.fields.startTime")}</Field.Label>
              <Input
                type="datetime-local"
                {...register("start_time", { required: true })}
              />
            </Field.Root>

            <Field.Root required flex={1}>
              <Field.Label>{t("events.programm.fields.endTime")}</Field.Label>
              <Input
                type="datetime-local"
                {...register("end_time", { required: true })}
              />
            </Field.Root>
          </HStack>

          <HStack justify="flex-end" gap={2}>
            <Button variant="ghost" onClick={onCancel}>
              <LuX /> {t("events.programm.actions.cancel")}
            </Button>
            <Button type="submit" colorPalette="blue">
              <LuCheck /> {t("events.programm.actions.save")}
            </Button>
          </HStack>
        </Stack>
      </Fieldset.Root>
    </Box>
  );
};

const ProgrammsListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setTitle, setActions } = useLayout();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId") || "";

  const [insertPosition, setInsertPosition] = useState<InsertPosition | null>(
    null,
  );

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
    setActions(<ProgrammsListActions />);
  }, [setTitle, setActions, t]);

  const sessions = sessionsResult?.data || [];
  const allProgramms = programmsResult?.data || [];

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
    // Convert datetime-local to ISO string without timezone conversion
    const startTime = data.start_time
      ? `${data.start_time}:00`
      : new Date().toISOString();
    const endTime = data.end_time
      ? `${data.end_time}:00`
      : new Date().toISOString();

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
    // Convert datetime-local to ISO string without timezone conversion
    const startTime = data.start_time
      ? `${data.start_time}:00`
      : new Date().toISOString();
    const endTime = data.end_time
      ? `${data.end_time}:00`
      : new Date().toISOString();

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

      {/* Timeline */}
      <Timeline.Root>
        {sessions.length === 0 ? (
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
          sessions.map((session: EventSession, sessionIndex: number) => (
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
                  <Card.Root mb={4}>
                    <Card.Header>
                      <Card.Title>{session.name}</Card.Title>
                      <Card.Description>
                        {new Date(session.startTime).toLocaleString()} -{" "}
                        {new Date(session.endTime).toLocaleString()}
                      </Card.Description>
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
                                  insertPosition.sessionId === session.id &&
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
                                            programmIndex > 0
                                              ? programmsBySession[session.id][
                                                  programmIndex - 1
                                                ].id
                                              : undefined,
                                        })
                                      }
                                    />
                                  )}
                                </Box>
                              )}

                              {/* Programm Item */}
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
                              </HStack>
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
                                    programmsBySession[session.id].length - 1
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
                                label={t("events.programm.actions.addProgramm")}
                                size="xs"
                                onClick={() =>
                                  setInsertPosition({
                                    type: "programm",
                                    sessionId: session.id,
                                    afterProgrammId:
                                      programmsBySession[session.id]?.length > 0
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
                </Timeline.Content>
              </Timeline.Item>
            </Box>
          ))
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
    </VStack>
  );
};

export default ProgrammsListPage;
