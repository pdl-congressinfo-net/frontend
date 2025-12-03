import { useCan, useCreate, useUpdate } from "@refinedev/core";
import { Box, Button, Card, Flex, Heading, Icon, Tabs } from "@chakra-ui/react";
import { LuCircleMinus, LuCircleCheck, LuCircleX } from "react-icons/lu";

import { Link } from "react-router";
import React from "react";
import BasicInformation, {
  BasicInformationValues,
} from "../../components/Events/Create/Basic";
import Location, {
  PhysicalLocationFormValues,
  WebinarLocationFormValues,
} from "../../components/Events/Create/Location";
import {
  CreateEventRequest,
  UpdateEventRequest,
} from "../../features/events/event.requests";
import {
  CreateLocationRequest,
  UpdateLocationRequest,
} from "../../features/locations/location.requests";

type StepStatus = "done" | "error" | "open";

type SaveResult = { success?: boolean; id?: string };

type StoredEventInfo = {
  id?: string;
  locationId?: string;
  data: BasicInformationValues;
};

type StoredLocationInfo =
  | { id?: string; kind: "physical"; data: PhysicalLocationFormValues }
  | { id?: string; kind: "webinar"; data: WebinarLocationFormValues };

const normalizeEventValues = (
  data: BasicInformationValues,
): BasicInformationValues => ({
  ...data,
  endDate: data.oneDay ? data.startDate : data.endDate ?? data.startDate,
});

const isSameEventValues = (
  a: BasicInformationValues,
  b: BasicInformationValues,
) =>
  a.name === b.name &&
  a.startDate === b.startDate &&
  (a.endDate ?? "") === (b.endDate ?? "") &&
  a.oneDay === b.oneDay &&
  a.typeId === b.typeId &&
  a.typeCode === b.typeCode &&
  a.field === b.field;

const normalizePhysicalLocation = (
  data: PhysicalLocationFormValues,
): PhysicalLocationFormValues => ({
  name: data.name?.trim() ?? "",
  road: data.road?.trim() ?? "",
  number: data.number?.trim() ?? "",
  postalCode: data.postalCode?.trim() ?? "",
  city: data.city?.trim() ?? "",
  lat: data.lat,
  lng: data.lng,
  country: data.country?.trim() ?? "",
  countryId: data.countryId?.trim() ?? "",
});

const isSamePhysicalLocation = (
  a: PhysicalLocationFormValues,
  b: PhysicalLocationFormValues,
) =>
  a.name === b.name &&
  a.road === b.road &&
  a.number === b.number &&
  a.postalCode === b.postalCode &&
  a.city === b.city &&
  a.country === b.country &&
  a.countryId === b.countryId &&
  (a.lat ?? null) === (b.lat ?? null) &&
  (a.lng ?? null) === (b.lng ?? null);

const normalizeWebinarLocation = (
  data: WebinarLocationFormValues,
): WebinarLocationFormValues => ({
  name: data.name?.trim() ?? "",
  link: data.link?.trim() ?? "",
});

const isSameWebinarLocation = (
  a: WebinarLocationFormValues,
  b: WebinarLocationFormValues,
) => a.name === b.name && a.link === b.link;

const toOptionalString = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
};

const unwrapData = <T,>(result: any): T | undefined => {
  if (!result) return undefined;
  if (result.data && typeof result.data === "object") {
    const inner = result.data;
    if (inner && typeof inner === "object" && "data" in inner) {
      return (inner as any).data as T;
    }
    return inner as T;
  }
  return result as T;
};

export const steps: { id: string; title: string }[] = [
  { id: "event", title: "Basic Information" },
  { id: "location", title: "Location" },
  { id: "images", title: "Images" },
  { id: "tickets", title: "Tickets" },
  { id: "review", title: "Review & Submit" },
];

export const getStatusIndicator = (status: StepStatus) => {
  switch (status) {
    case "done":
      return { color: "green.500", element: <LuCircleCheck /> };
    case "error":
      return { color: "red.500", element: <LuCircleX /> };
    case "open":
      return { color: undefined, element: <LuCircleMinus /> };
  }
};

type Props = {};
const CreateEventPage = ({}: Props) => {
  const { data: canAccess } = useCan({
    resource: "events",
    action: "create",
  });
  const [currentStep, setCurrentStep] = React.useState("event");
  const [eventInfo, setEventInfo] = React.useState<StoredEventInfo | null>(
    null,
  );
  const [locationInfo, setLocationInfo] = React.useState<
    StoredLocationInfo | null
  >(null);

  const { mutateAsync: createEvent } = useCreate({ resource: "events" });
  const { mutateAsync: updateEvent } = useUpdate({ resource: "events" });
  const { mutateAsync: createLocation } = useCreate({ resource: "locations" });
  const { mutateAsync: updateLocation } = useUpdate({ resource: "locations" });

  const [status, setStatus] = React.useState<{
    [key: string]: StepStatus;
  }>({
    event: "open",
    location: "open",
    images: "open",
    tickets: "open",
    review: "open",
  });

  React.useEffect(() => {
    if (!eventInfo?.data?.typeCode || !locationInfo) return;
    const expectedKind = eventInfo.data.typeCode === "WEB" ? "webinar" : "physical";
    if (locationInfo.kind !== expectedKind) {
      setLocationInfo(null);
      setEventInfo((prev) => (prev ? { ...prev, locationId: undefined } : prev));
    }
  }, [eventInfo?.data?.typeCode, locationInfo?.kind]);

  const stepOrder = steps.map((s) => s.id);
  const goNext = () => {
    const idx = stepOrder.indexOf(currentStep);
    const nextId = stepOrder[Math.min(idx + 1, stepOrder.length - 1)];
    setCurrentStep(nextId);
  };
  const goPrevious = () => {
    const idx = stepOrder.indexOf(currentStep);
    const prevId = stepOrder[Math.max(idx - 1, 0)];
    setCurrentStep(prevId);
  };

  const handleBasicStatus = React.useCallback(
    (s: StepStatus) => setStatus((prev) => ({ ...prev, event: s })),
    [],
  );

  const handleLocationStatus = React.useCallback(
    (s: StepStatus) => setStatus((prev) => ({ ...prev, location: s })),
    [],
  );

  const eventTypeCode = eventInfo?.data?.typeCode ?? null;
  const isWebEvent = eventTypeCode === "WEB";
  const locationInitialValues =
    locationInfo &&
    locationInfo.kind === (isWebEvent ? "webinar" : "physical")
      ? locationInfo.data
      : undefined;
  const locationRenderKey = isWebEvent ? "web" : "physical";

  // Persist step data by creating/updating backend entities and tracking ids for cross-step linkage.
  const handleSave = React.useCallback(
    async (
      data:
        | BasicInformationValues
        | PhysicalLocationFormValues
        | WebinarLocationFormValues,
      step: "event" | "location",
    ): Promise<SaveResult> => {
      if (step === "event") {
        const normalized = normalizeEventValues(
          data as BasicInformationValues,
        );

        if (!eventInfo?.id) {
          const createPayload: CreateEventRequest = {
            name: normalized.name,
            start_date: new Date(normalized.startDate),
            end_date: new Date(
              normalized.endDate ?? normalized.startDate,
            ),
            category_id: normalized.field,
            type_id: normalized.typeId,
            location_id: locationInfo?.id,
          };

          const response = await createEvent({ values: createPayload });
          const created = unwrapData<any>(response);
          const newId = created?.id;
          const locationId = created?.location_id ?? locationInfo?.id;
          setEventInfo({ id: newId, locationId, data: normalized });
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
          return { success: true, id: eventInfo.id };
        }

        const currentEventId = eventInfo.id;

        const updatePayload: UpdateEventRequest = {
          name: normalized.name,
          start_date: new Date(normalized.startDate),
          end_date: new Date(
            normalized.endDate ?? normalized.startDate,
          ),
          category_id: normalized.field,
          type_id: normalized.typeId,
          location_id: eventInfo.locationId,
        };

        await updateEvent({ id: currentEventId, values: updatePayload });
        setEventInfo((prev) =>
          prev
            ? { ...prev, data: normalized }
            : {
                id: currentEventId,
                locationId: eventInfo.locationId,
                data: normalized,
              },
        );
        return { success: true, id: currentEventId };
      }

      if (step === "location") {
        if (!eventInfo?.id) {
          throw new Error("Save basic event information before the location.");
        }

        const currentEventId = eventInfo.id;
        const isWebEvent = eventInfo.data.typeCode === "WEB";

        if (isWebEvent) {
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
            const response = await createLocation({
              values: createPayload,
            });
            const created = unwrapData<any>(response);
            locationId = created?.id ?? locationId;
          } else if (
            !existing || !isSameWebinarLocation(existing.data, normalized)
          ) {
            const updatePayload: UpdateLocationRequest = {
              name: normalized.name,
              link: normalized.link,
            };
            await updateLocation({
              id: locationId,
              values: updatePayload,
            });
          }

          if (locationId && eventInfo.locationId !== locationId) {
            await updateEvent({
              id: currentEventId,
              values: { location_id: locationId },
            });
            setEventInfo((prev) =>
              prev ? { ...prev, locationId } : prev,
            );
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
            lat: normalized.lat,
            lng: normalized.lng,
            country_id: toOptionalString(normalized.countryId),
          };
          const response = await createLocation({
            values: createPayload,
          });
          const created = unwrapData<any>(response);
          locationId = created?.id ?? locationId;
        } else if (
          !existing || !isSamePhysicalLocation(existing.data, normalized)
        ) {
          const updatePayload: UpdateLocationRequest = {
            name: normalized.name,
            road: toOptionalString(normalized.road),
            number: toOptionalString(normalized.number),
            postal_code: toOptionalString(normalized.postalCode),
            city: toOptionalString(normalized.city),
            lat: normalized.lat,
            lng: normalized.lng,
            country_id: toOptionalString(normalized.countryId),
          };
          await updateLocation({ id: locationId, values: updatePayload });
        }

        if (locationId && eventInfo.locationId !== locationId) {
          await updateEvent({
            id: currentEventId,
            values: { location_id: locationId },
          });
          setEventInfo((prev) =>
            prev ? { ...prev, locationId } : prev,
          );
        }

        setLocationInfo({
          id: locationId,
          kind: "physical",
          data: normalized,
        });

        return { success: true, id: locationId };
      }

      return { success: true };
    },
    [
      createEvent,
      updateEvent,
      createLocation,
      updateLocation,
      eventInfo,
      locationInfo,
    ],
  );

  return (
    <>
      <Flex justify="space-between" mb={4}>
        <Heading>Create Events</Heading>
        {canAccess && (
          <Link to="/events/create">
            <Button
              variant="ghost"
              rounded="full"
              mb={4}
              _hover={{
                transform: "scale(1.2)",
                transition: "transform 0.15s ease-in-out",
                backgroundColor: "transparent",
              }}
              _active={{ transform: "scale(1.1)" }}
            >
              <LuCircleMinus size={44} />
            </Button>
          </Link>
        )}
      </Flex>
      <Card.Root>
        <Card.Body>
          <Tabs.Root
            orientation="vertical"
            value={currentStep}
            onValueChange={(e) => setCurrentStep(e.value)}
          >
            <Flex direction="row" gap={4}>
              <Box width={"20vw"} height={"65vh"} py={4} alignContent="center">
                <Tabs.List display="flex" flexDirection="column" gap={2}>
                  {steps.map((step) => {
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
                            transition={"0.2s ease-in-out"}
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
              <Box
                flex="1"
                height={"65vh"}
                overflowY="auto"
                py={4}
                width={"80vw"}
              >
                <Tabs.Content value="event">
                  <BasicInformation
                    onNext={goNext}
                    onPrevious={goPrevious}
                    onStatus={handleBasicStatus}
                    onSave={(data) => handleSave(data, "event")}
                    initialValues={eventInfo?.data}
                  />
                </Tabs.Content>
                <Tabs.Content value="location">
                  <Location
                    key={locationRenderKey}
                    onNext={goNext}
                    onPrevious={goPrevious}
                    onStatus={handleLocationStatus}
                    onSave={(data) => handleSave(data, "location")}
                    eventTypeCode={eventTypeCode}
                    initialValues={locationInitialValues}
                  />
                </Tabs.Content>
                <Tabs.Content value="images">
                  <Box>Images Content</Box>
                </Tabs.Content>
                <Tabs.Content value="tickets">
                  <Box>Tickets Content</Box>
                </Tabs.Content>
                <Tabs.Content value="review">
                  <Box>Review & Submit Content</Box>
                </Tabs.Content>
              </Box>
            </Flex>
          </Tabs.Root>
        </Card.Body>
      </Card.Root>
    </>
  );
};

export default CreateEventPage;
