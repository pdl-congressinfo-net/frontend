import React from "react";
import { Link } from "react-router";
import { useCan, useCreate, useOne, useUpdate } from "@refinedev/core";
import {
  Box,
  Button,
  Card,
  Flex,
  Icon,
  Spinner,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";

import BasicInformation from "./Basic";
import Location from "./Location";
import {
  BasicInformationValues,
  PhysicalLocationFormValues,
  WebinarLocationFormValues,
} from "./types";
import {
  StepStatus,
  SaveResult,
  StoredEventInfo,
  StoredLocationInfo,
  steps,
  getStatusIndicator,
  normalizeEventValues,
  isSameEventValues,
  normalizePhysicalLocation,
  isSamePhysicalLocation,
  normalizeWebinarLocation,
  isSameWebinarLocation,
  toOptionalString,
  unwrapData,
  EventDetail,
  LocationDetail,
} from "./form-shared";
import {
  CreateEventRequest,
  UpdateEventRequest,
} from "../../../features/events/events.requests";

import {
  CreateLocationRequest,
  UpdateLocationRequest,
} from "../../../features/locations/location.requests";
import { EventType } from "../../../features/events/events.model";

export type UpsertMode = "create" | "edit";

type UpsertTabHelpers = {
  goNext: () => void;
  goPrevious: () => void;
  setStatus: (status: StepStatus) => void;
};

type UpsertExtraTab = {
  id: string;
  title: string;
  render: (helpers: UpsertTabHelpers) => React.ReactNode;
};

type UpsertProps = {
  mode: UpsertMode;
  eventId?: string;
  backHref?: string;
  extraTabs?: UpsertExtraTab[];
};

const Upsert = ({
  mode,
  eventId,
  backHref = "/events",
  extraTabs,
}: UpsertProps) => {
  const isEdit = mode === "edit";
  const permissionAction = isEdit ? "update" : "create";
  const { data: canAccess } = useCan({
    resource: "events",
    action: permissionAction,
  });
  const missingEventId = isEdit && !eventId;

  const extraTabMap = React.useMemo(() => {
    const map = new Map<string, UpsertExtraTab>();
    extraTabs?.forEach((tab) => {
      map.set(tab.id, tab);
    });
    return map;
  }, [extraTabs]);

  const mergedSteps = React.useMemo(() => {
    const base = [...steps];
    extraTabs?.forEach((tab) => {
      if (!base.some((step) => step.id === tab.id)) {
        base.push({ id: tab.id, title: tab.title });
      }
    });
    return base;
  }, [extraTabs]);

  const [currentStep, setCurrentStep] = React.useState(
    () => mergedSteps[0]?.id ?? "event",
  );
  const [eventInfo, setEventInfo] = React.useState<StoredEventInfo | null>(
    null,
  );
  const [basicDraft, setBasicDraft] =
    React.useState<BasicInformationValues | null>(null);
  const basicDirtyRef = React.useRef(false);
  const [locationInfo, setLocationInfo] =
    React.useState<StoredLocationInfo | null>(null);
  const [status, setStatus] = React.useState<Record<string, StepStatus>>(() => {
    const initial: Record<string, StepStatus> = {};
    mergedSteps.forEach((step) => {
      initial[step.id] = "open";
    });
    return initial;
  });

  React.useEffect(() => {
    if (!mergedSteps.some((step) => step.id === currentStep)) {
      setCurrentStep(mergedSteps[0]?.id ?? "event");
    }
  }, [mergedSteps, currentStep]);

  React.useEffect(() => {
    setStatus((prev) => {
      const next: Record<string, StepStatus> = {};
      mergedSteps.forEach((step) => {
        next[step.id] = prev[step.id] ?? "open";
      });
      return next;
    });
  }, [mergedSteps]);

  const stepOrder = React.useMemo(
    () => mergedSteps.map((s) => s.id),
    [mergedSteps],
  );

  const goNext = React.useCallback(() => {
    const idx = stepOrder.indexOf(currentStep);
    const nextId = stepOrder[Math.min(idx + 1, stepOrder.length - 1)];
    setCurrentStep(nextId);
  }, [currentStep, stepOrder]);

  const goPrevious = React.useCallback(() => {
    const idx = stepOrder.indexOf(currentStep);
    const prevId = stepOrder[Math.max(idx - 1, 0)];
    setCurrentStep(prevId);
  }, [currentStep, stepOrder]);

  const handleBasicStatus = React.useCallback(
    (s: StepStatus) => setStatus((prev) => ({ ...prev, event: s })),
    [],
  );

  const handleLocationStatus = React.useCallback(
    (s: StepStatus) => setStatus((prev) => ({ ...prev, location: s })),
    [],
  );

  React.useEffect(() => {
    if (!eventInfo?.data) return;
    setStatus((prev) =>
      prev.event === "open" ? { ...prev, event: "done" } : prev,
    );
  }, [eventInfo?.data]);

  React.useEffect(() => {
    if (!locationInfo?.data) return;
    setStatus((prev) =>
      prev.location === "open" ? { ...prev, location: "done" } : prev,
    );
  }, [locationInfo?.data]);

  const renderAdditionalTab = React.useCallback(
    (tabId: string, title: string) => {
      const extraTab = extraTabMap.get(tabId);
      if (!extraTab) {
        return <Box>{title}</Box>;
      }
      return extraTab.render({
        goNext,
        goPrevious,
        setStatus: (nextStatus) =>
          setStatus((prev) => ({ ...prev, [tabId]: nextStatus })),
      });
    },
    [extraTabMap, goNext, goPrevious, setStatus],
  );

  const { mutateAsync: createEvent } = useCreate({ resource: "events" });
  const { mutateAsync: updateEvent } = useUpdate({ resource: "events" });
  const { mutateAsync: createLocation } = useCreate({ resource: "locations" });
  const { mutateAsync: updateLocation } = useUpdate({ resource: "locations" });

  const shouldLoadEvent = isEdit && Boolean(eventId);
  const {
    result: eventResult,
    query: {
      isLoading: isEventLoading,
      isError: isEventError,
      error: eventError,
    },
  } = useOne<EventDetail>({
    resource: "events",
    id: eventId ?? "",
    queryOptions: {
      enabled: shouldLoadEvent,
    },
  });

  const eventRecord = React.useMemo<EventDetail | undefined>(() => {
    if (!eventResult) return undefined;
    return unwrapData<EventDetail>(eventResult) ?? eventResult;
  }, [eventResult]);

  const locationIdFromEvent =
    eventRecord?.locationId ?? eventRecord?.location?.id ?? undefined;

  const { result: locationResult } = useOne<LocationDetail>({
    resource: "locations",
    id: locationIdFromEvent ?? "",
    queryOptions: {
      enabled: Boolean(locationIdFromEvent),
    },
  });

  const locationRecord = React.useMemo<LocationDetail | undefined>(() => {
    if (!locationResult) return undefined;
    return unwrapData<LocationDetail>(locationResult) ?? locationResult;
  }, [locationResult]);

  const eventTypeIdFromDraft = basicDraft?.eventTypeId || eventInfo?.data.eventTypeId;

  const { result: eventTypeResult } = useOne<EventType>({
    resource: "types",
    id: eventTypeIdFromDraft ?? "",
    queryOptions: {
      enabled: Boolean(eventTypeIdFromDraft),
    },
    meta: {
      parentmodule: "events",
    },
  });

  const eventTypeRecord = React.useMemo<EventType | undefined>(() => {
    if (!eventTypeResult) return undefined;
    return unwrapData<EventType>(eventTypeResult) ?? eventTypeResult;
  }, [eventTypeResult]);

  const isWebinar = React.useMemo(() => {
    return eventTypeRecord?.code === "WEB";
  }, [eventTypeRecord?.code]);

  const handleBasicChange = React.useCallback(
    (values: BasicInformationValues, meta?: { source: "user" | "sync" }) => {
      setBasicDraft((prev) =>
        prev && isSameEventValues(prev, values) ? prev : values,
      );
      if (meta?.source === "user") {
        basicDirtyRef.current = true;
      }
    },
    [],
  );

  React.useEffect(() => {
    if (!isEdit || !eventRecord?.id) return;

    const startDate = toInputDate(eventRecord.start_date);
    const endDate = toInputDate(eventRecord.end_date);
    const safeStart = startDate ?? new Date().toISOString().slice(0, 10);
    const normalized = normalizeEventValues({
      name: eventRecord.name ?? "",
      startDate: safeStart,
      endDate: endDate ?? undefined,
      oneDay: !endDate || startDate === endDate,
      eventTypeId:
        eventRecord.event_type_id ??
        eventRecord.eventTypeId ??
        eventRecord.event_type?.id ??
        eventRecord.eventType?.id ??
        "",
      isPublic: eventRecord.is_public ?? eventRecord.isPublic ?? false,
    } as BasicInformationValues);

    const resolvedLocationId =
      locationIdFromEvent ?? eventInfo?.locationId ?? undefined;

    setEventInfo((prev) => {
      if (prev) {
        const nextLocationId = resolvedLocationId ?? prev.locationId;
        if (nextLocationId !== prev.locationId) {
          return { ...prev, locationId: nextLocationId };
        }
        return prev;
      }
      return {
        id: eventRecord.id,
        locationId: resolvedLocationId,
        data: normalized,
      };
    });
    basicDirtyRef.current = false;
    setBasicDraft((prev) =>
      prev && isSameEventValues(prev, normalized) ? prev : normalized,
    );
  }, [isEdit, eventRecord, locationIdFromEvent, eventInfo?.locationId]);

  React.useEffect(() => {
    const candidateLocation =
      locationRecord ?? eventRecord?.location ?? undefined;

    if (!candidateLocation?.id) return;

    setEventInfo((prev) => {
      if (!prev) return prev;
      if (prev.locationId === candidateLocation.id) return prev;
      return { ...prev, locationId: candidateLocation.id ?? prev.locationId };
    });

    const isWeb = Boolean(candidateLocation.link) || isWebinar;

    setLocationInfo((prev) => {
      if (prev && prev.kind === (isWeb ? "webinar" : "physical")) {
        return prev;
      }

      if (isWeb) {
        const normalized = normalizeWebinarLocation({
          name: candidateLocation.name ?? "",
          link: candidateLocation.link ?? "",
        } as WebinarLocationFormValues);
        return {
          id: candidateLocation.id ?? undefined,
          kind: "webinar",
          data: normalized,
        };
      }

      const physicalValues = normalizePhysicalLocation({
        name: candidateLocation.name ?? "",
        road: candidateLocation.road,
        number: candidateLocation.number,
        postalCode:
          candidateLocation.postal_code ?? candidateLocation.postalCode,
        city: candidateLocation.city,
        latitude:
          candidateLocation.latitude != null
            ? candidateLocation.latitude
            : undefined,
        longitude:
          candidateLocation.longitude != null
            ? candidateLocation.longitude
            : undefined,
        countryId:
          candidateLocation.country_id ??
          candidateLocation.countryId ??
          (typeof candidateLocation.country !== "string"
            ? (candidateLocation.country?.id ?? "")
            : ""),
      } as PhysicalLocationFormValues);

      return {
        id: candidateLocation.id ?? undefined,
        kind: "physical",
        data: physicalValues,
      };
    });
  }, [locationRecord, eventRecord?.location, isWebinar]);

  React.useEffect(() => {
    if (!locationInfo && isWebinar) {
      setLocationInfo({
        kind: "webinar",
        data: {
          name: "",
          link: "",
        },
      });
    } else if (locationInfo && locationInfo.kind !== (isWebinar ? "webinar" : "physical")) {
      if (isWebinar) {
        setLocationInfo({
          id: locationInfo.id,
          kind: "webinar",
          data: {
            name: "",
            link: "",
          },
        });
      } else {
        setLocationInfo({
          id: locationInfo.id,
          kind: "physical",
          data: {
            name: "",
            road: "",
            number: "",
            postalCode: "",
            city: "",
            latitude: undefined,
            longitude: undefined,
            countryId: "",
          },
        });
      }
    }
  }, [isWebinar, locationInfo]);

  const eventValuesForRender = basicDraft ?? eventInfo?.data ?? null;
  const locationInitialValues = locationInfo?.data;
  const locationRenderKey = locationInfo?.kind ?? "physical";

  const handleSave = React.useCallback(
    async (
      data:
        | BasicInformationValues
        | PhysicalLocationFormValues
        | WebinarLocationFormValues,
      step: "event" | "location",
    ): Promise<SaveResult> => {
      if (step === "event") {
        const normalized = normalizeEventValues(data as BasicInformationValues);

        if (!eventInfo?.id) {
          if (mode !== "create") {
            throw new Error("Event details are not ready yet.");
          }

          const createPayload: CreateEventRequest = {
            name: normalized.name,
            start_date: new Date(normalized.startDate),
            end_date: new Date(normalized.endDate ?? normalized.startDate),
            location_id: locationInfo?.id,
            is_public: normalized.isPublic,
            event_type_id: normalized.eventTypeId || undefined,
          };

          const response = await createEvent({ values: createPayload });
          const created = unwrapData<any>(response);
          const newId = created?.id;
          const createdLocationId = created?.location_id ?? locationInfo?.id;
          setEventInfo({
            id: newId,
            locationId: createdLocationId,
            data: normalized,
          });
          basicDirtyRef.current = false;
          setBasicDraft(normalized);
          return { success: true, id: newId };
        }

        if (isSameEventValues(eventInfo.data, normalized)) {
          setEventInfo((prev) =>
            prev
              ? { ...prev, data: normalized }
              : {
                  id: eventInfo.id,
                  locationId: eventInfo.locationId,
                  data: normalized,
                },
          );
          basicDirtyRef.current = false;
          setBasicDraft(normalized);
          return { success: true, id: eventInfo.id };
        }

        const updatePayload: UpdateEventRequest = {
          name: normalized.name,
          start_date: new Date(normalized.startDate),
          end_date: new Date(normalized.endDate ?? normalized.startDate),
          location_id: locationInfo?.id,
          is_public: normalized.isPublic,
          event_type_id: normalized.eventTypeId || undefined,
        };

        await updateEvent({ id: eventInfo.id, values: updatePayload });
        setEventInfo((prev) =>
          prev
            ? { ...prev, data: normalized }
            : {
                id: eventInfo.id,
                locationId: eventInfo.locationId,
                data: normalized,
              },
        );
        basicDirtyRef.current = false;
        setBasicDraft(normalized);
        return { success: true, id: eventInfo.id };
      }

      if (step === "location") {
        if (!eventInfo?.id) {
          throw new Error(
            "Save the basic event information before the location.",
          );
        }

        const currentEventId = eventInfo.id;
        const isWeb = locationInfo?.kind === "webinar";

        if (isWeb) {
          const normalized = normalizeWebinarLocation(
            data as WebinarLocationFormValues,
          );
          const existing =
            locationInfo?.kind === "webinar" ? locationInfo : null;
          let locationId = existing?.id;

          if (!locationId) {
            const createPayload: CreateLocationRequest = {
              name: normalized.name,
              link: normalized.link,
            };
            const response = await createLocation({ values: createPayload });
            const created = unwrapData<any>(response);
            locationId = created?.id ?? locationId;
          } else if (
            !existing ||
            !isSameWebinarLocation(existing.data, normalized)
          ) {
            const updatePayload: UpdateLocationRequest = {
              name: normalized.name,
              link: normalized.link,
            };
            await updateLocation({ id: locationId, values: updatePayload });
          }

          if (locationId && eventInfo.locationId !== locationId) {
            await updateEvent({
              id: currentEventId,
              values: { location_id: locationId },
            });
            setEventInfo((prev) => (prev ? { ...prev, locationId } : prev));
          }

          setLocationInfo({
            id: locationId,
            kind: "webinar",
            data: normalized,
          });

          return { success: true, id: locationId };
        }

        const normalized = normalizePhysicalLocation(
          data as PhysicalLocationFormValues,
        );
        const existing =
          locationInfo?.kind === "physical" ? locationInfo : null;
        let locationId = existing?.id;

        if (!locationId) {
          const createPayload: CreateLocationRequest = {
            name: normalized.name,
            road: toOptionalString(normalized.road),
            number: toOptionalString(normalized.number),
            postal_code: toOptionalString(normalized.postalCode),
            city: toOptionalString(normalized.city),
            latitude: normalized.latitude,
            longitude: normalized.longitude,
            country_id: toOptionalString(normalized.countryId),
          };
          const response = await createLocation({ values: createPayload });
          const created = unwrapData<any>(response);
          locationId = created?.id ?? locationId;
        } else if (
          !existing ||
          !isSamePhysicalLocation(existing.data, normalized)
        ) {
          const updatePayload: UpdateLocationRequest = {
            name: normalized.name,
            road: toOptionalString(normalized.road),
            number: toOptionalString(normalized.number),
            postal_code: toOptionalString(normalized.postalCode),
            city: toOptionalString(normalized.city),
            latitude: normalized.latitude,
            longitude: normalized.longitude,
            country_id: toOptionalString(normalized.countryId),
          };
          await updateLocation({ id: locationId, values: updatePayload });
        }

        if (locationId && eventInfo.locationId !== locationId) {
          await updateEvent({
            id: currentEventId,
            values: { location_id: locationId },
          });
          setEventInfo((prev) => (prev ? { ...prev, locationId } : prev));
        }

        setLocationInfo({
          id: locationId,
          kind: "physical",
          data: normalized,
        });

        return { success: true, id: locationId };
      }

      throw new Error(`Unhandled step ${step}`);
    },
    [
      eventInfo,
      locationInfo,
      mode,
      createEvent,
      updateEvent,
      createLocation,
      updateLocation,
    ],
  );

  if (isEdit && isEventLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (missingEventId) {
    return (
      <Flex
        direction="column"
        gap={4}
        align="center"
        justify="center"
        minH="60vh"
      >
        <Text fontSize="lg" color="red.500">
          Event identifier is missing.
        </Text>
        <Link to={backHref}>
          <Button>
            <Flex align="center" gap={2}>
              <LuArrowLeft />
              <span>Back</span>
            </Flex>
          </Button>
        </Link>
      </Flex>
    );
  }

  if (isEdit && (isEventError || !eventRecord?.id)) {
    return (
      <Flex
        direction="column"
        gap={4}
        align="center"
        justify="center"
        minH="60vh"
      >
        <Text fontSize="lg" color="red.500">
          {eventError?.message ?? "Unable to load event details."}
        </Text>
        <Link to={backHref}>
          <Button>
            <Flex align="center" gap={2}>
              <LuArrowLeft />
              <span>Back</span>
            </Flex>
          </Button>
        </Link>
      </Flex>
    );
  }

  if (canAccess?.can === false) {
    return (
      <Flex
        direction="column"
        gap={4}
        align="center"
        justify="center"
        minH="60vh"
      >
        <Text fontSize="lg">
          {isEdit
            ? "You do not have permission to edit events."
            : "You do not have permission to create events."}
        </Text>
        <Link to={backHref}>
          <Button>
            <Flex align="center" gap={2}>
              <LuArrowLeft />
              <span>Back</span>
            </Flex>
          </Button>
        </Link>
      </Flex>
    );
  }

  return (
    <>
      <Card.Root shadow="md" border="1px solid" borderColor="gray.200">
        <Card.Body>
          <Tabs.Root
            orientation="vertical"
            value={currentStep}
            onValueChange={(e) => setCurrentStep(e.value)}
          >
            <Flex direction="row" gap={4}>
              <Box width="20vw" height="65vh" py={4} alignContent="center">
                <Tabs.List display="flex" flexDirection="column" gap={2}>
                  {mergedSteps.map((step) => {
                    const stepStatus = status[step.id] ?? "open";
                    const statusIndicator = getStatusIndicator(stepStatus);
                    const isActive = currentStep === step.id;
                    return (
                      <Tabs.Trigger
                        key={step.id}
                        value={step.id}
                        display="flex"
                        alignItems="center"
                        gap={3}
                        py={3}
                        px={4}
                        borderRadius="md"
                        cursor="pointer"
                      >
                        <Box
                          position="relative"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          minWidth="24px"
                        >
                          <Icon
                            size={isActive ? "lg" : "md"}
                            color={statusIndicator.color}
                            transition="0.2s ease-in-out"
                          >
                            {statusIndicator.element}
                          </Icon>
                        </Box>
                        <Box
                          flex="1"
                          textAlign="left"
                          fontSize="sm"
                          fontWeight={isActive ? "bold" : "normal"}
                        >
                          {step.title}
                        </Box>
                      </Tabs.Trigger>
                    );
                  })}
                </Tabs.List>
              </Box>
              <Box flex="1" height="65vh" overflowY="auto" py={4} width="80vw">
                <Tabs.Content value="event">
                  <BasicInformation
                    onNext={goNext}
                    onPrevious={goPrevious}
                    onStatus={handleBasicStatus}
                    onSave={(data) => handleSave(data, "event")}
                    initialValues={eventValuesForRender}
                    onChange={handleBasicChange}
                  />
                </Tabs.Content>
                <Tabs.Content value="location">
                  <Location
                    key={locationRenderKey}
                    onNext={goNext}
                    onPrevious={goPrevious}
                    onStatus={handleLocationStatus}
                    onSave={(data) => handleSave(data, "location")}
                    initialValues={locationInitialValues}
                    isWebinar={isWebinar}
                  />
                </Tabs.Content>
                {mergedSteps
                  .filter(
                    (step) => step.id !== "event" && step.id !== "location",
                  )
                  .map((step) => (
                    <Tabs.Content key={step.id} value={step.id}>
                      {renderAdditionalTab(step.id, step.title)}
                    </Tabs.Content>
                  ))}
              </Box>
            </Flex>
          </Tabs.Root>
        </Card.Body>
      </Card.Root>
    </>
  );
};

const toInputDate = (value?: string | Date): string | undefined => {
  if (!value) return undefined;

  const toYMD = (date: Date) => {
    if (Number.isNaN(date.getTime())) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (value instanceof Date) {
    return toYMD(value);
  }

  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.slice(0, 10);
    }
    const parsed = new Date(value);
    return toYMD(parsed);
  }

  return undefined;
};

export type { UpsertProps, UpsertExtraTab, UpsertTabHelpers };
export default Upsert;
