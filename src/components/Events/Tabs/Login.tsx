import { Heading } from "@chakra-ui/react";
import { useTranslation } from "@refinedev/core";
import { Event } from "../../../features/events/events.model";

interface InformationProps {
  event: Event;
}

export default function Information({ event }: InformationProps) {
  const { translate: t } = useTranslation();
  event;

  return <Heading>{t("events.messages.detailsInInternalArea")}</Heading>;
}
