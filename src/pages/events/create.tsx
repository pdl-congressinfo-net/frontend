import { useCan } from "@refinedev/core";
import { Box, Button, Card, Flex, Heading, Icon, Tabs } from "@chakra-ui/react";
import { LuCircleMinus, LuCircleCheck, LuCircleX } from "react-icons/lu";

import { Link } from "react-router";
import React from "react";
import BasicInformation from "../../components/Events/Create/Basic";
import Location from "../../components/Events/Create/Location";

type StepStatus = "done" | "error" | "open";

export const steps: { id: string; title: string }[] = [
  { id: "basic", title: "Basic Information" },
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
  const [currentStep, setCurrentStep] = React.useState("basic");
  const [basicInfo, setBasicInfo] = React.useState<any | null>(null);

  const [status, setStatus] = React.useState<{
    [key: string]: StepStatus;
  }>({
    basic: "open",
    location: "open",
    images: "open",
    tickets: "open",
    review: "open",
  });

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
    (s: StepStatus) => setStatus((prev) => ({ ...prev, basic: s })),
    [],
  );

  const handleLocationStatus = React.useCallback(
    (s: StepStatus) => setStatus((prev) => ({ ...prev, location: s })),
    [],
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
                    const statusIndicator = getStatusIndicator(status[step.id]);
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
                <Tabs.Content value="basic">
                  <BasicInformation
                    onNext={goNext}
                    onPrevious={goPrevious}
                    onStatus={handleBasicStatus}
                    onSave={(data: any) => setBasicInfo(data)}
                  />
                </Tabs.Content>
                <Tabs.Content value="location">
                  <Location
                    onNext={goNext}
                    onPrevious={goPrevious}
                    onStatus={handleLocationStatus}
                    eventTypeCode={basicInfo?.typeCode}
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
