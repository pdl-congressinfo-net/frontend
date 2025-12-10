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
  event;

  return <Heading>Programm wird im internen Bereich angezeigt</Heading>;
}
