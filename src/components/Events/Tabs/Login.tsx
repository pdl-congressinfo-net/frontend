import { Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Event } from "../../../features/events/events.model";

interface InformationProps {
  event: Event;
}

export default function Information({ event }: InformationProps) {
  const { t } = useTranslation();
  event;

  return <Heading>Details werden im internen Bereich angezeigt</Heading>;
}
