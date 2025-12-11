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
import { useTranslation } from "@refinedev/core";
import { LuCheck, LuCircleArrowLeft, LuCircleArrowRight } from "react-icons/lu";
import { useState } from "react";
import { Event } from "../../../features/events/events.model";

interface InformationProps {
  event: Event;
}
// Gala Dinner erst im Internen bereich
export default function Information({ event }: InformationProps) {
  const { translate: t } = useTranslation();
  event;

  return <Heading>{t("events.messages.programInInternalArea")}</Heading>;
}
