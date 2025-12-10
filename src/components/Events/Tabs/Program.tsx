import {
  Box,
  Heading,
  Text,
  Timeline,
  PaginationRoot,
  PaginationItems,
  PaginationPrevTrigger,
  PaginationNextTrigger,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import TabsLayout from "./TabsLayout";
import { useTranslation } from "react-i18next";
import { LuCheck, LuCircleArrowLeft, LuCircleArrowRight } from "react-icons/lu";
import { useState } from "react";
import { Event } from "../../../features/events/events.model";

interface InformationProps {
  event: Event;
}
// Gala Dinner erst im Internen bereich
export default function Information({ event }: InformationProps) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  return <Heading>Programm wird im internen Bereich angezeigt</Heading>;

  return (
    <TabsLayout>
      {days.length > 1 ? (
        <Box>
          <PaginationRoot
            count={days.length}
            pageSize={1}
            page={currentPage}
            onPageChange={(e) => setCurrentPage(e.page)}
          >
            <Heading size="md" mb={4}>
              {days[currentPage - 1].date.toLocaleDateString(t("locale"), {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Heading>
            <PaginationItems
              render={(page) => (
                <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                  {days[page.value - 1].date.toLocaleDateString(t("locale"), {
                    day: "numeric",
                  })}
                  .
                </IconButton>
              )}
            />
            <Box mb={4} mt={4}>
              <Timeline.Root maxW="400px">
                {days[currentPage - 1].sessions.map(
                  (sessions, sessionsIndex) => (
                    <Timeline.Item key={sessionsIndex}>
                      <Timeline.Content width="auto">
                        <Timeline.Title whiteSpace="nowrap">
                          {sessions.time}
                        </Timeline.Title>
                      </Timeline.Content>
                      <Timeline.Connector>
                        <Timeline.Separator />
                        <Timeline.Indicator>
                          <LuCheck />
                        </Timeline.Indicator>
                      </Timeline.Connector>
                      <Timeline.Content>
                        <Timeline.Title>{sessions.description}</Timeline.Title>
                        {sessions.speaker && (
                          <Timeline.Description>
                            {t("events.speakerBy")} {sessions.speaker}
                          </Timeline.Description>
                        )}
                      </Timeline.Content>
                    </Timeline.Item>
                  ),
                )}
              </Timeline.Root>
            </Box>
            <Flex justify="center" align="center" gap={4} mt={4}>
              <PaginationPrevTrigger
                as={IconButton}
                mr={2}
                variant={{ base: "ghost" }}
                rounded="full"
              >
                <LuCircleArrowLeft />
              </PaginationPrevTrigger>
              <Text>
                Tag: {currentPage} / {days.length}
              </Text>
              <PaginationNextTrigger
                as={IconButton}
                ml={2}
                variant={{ base: "ghost" }}
                rounded="full"
              >
                <LuCircleArrowRight />
              </PaginationNextTrigger>
            </Flex>
          </PaginationRoot>
        </Box>
      ) : (
        <Timeline.Root maxW="400px">
          {days[0].sessions.map((sessions, sessionsIndex) => (
            <Timeline.Item key={sessionsIndex}>
              <Timeline.Content width="auto">
                <Timeline.Title whiteSpace="nowrap">
                  {sessions.time}
                </Timeline.Title>
              </Timeline.Content>
              <Timeline.Connector>
                <Timeline.Separator />
                <Timeline.Indicator>
                  <LuCheck />
                </Timeline.Indicator>
              </Timeline.Connector>
              <Timeline.Content>
                <Timeline.Title>{sessions.description}</Timeline.Title>
                {sessions.speaker && (
                  <Timeline.Description>
                    {t("events.speakerBy")} {sessions.speaker}
                  </Timeline.Description>
                )}
              </Timeline.Content>
            </Timeline.Item>
          ))}
        </Timeline.Root>
      )}
    </TabsLayout>
  );
}
