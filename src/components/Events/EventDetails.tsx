import { Tabs } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { LuClipboardList, LuInfo, LuLogIn, LuUsers } from "react-icons/lu";

import { useCan } from "@refinedev/core";
import Information from "./Tabs/Information";
import Login from "./Tabs/Login";
import Program from "./Tabs/Program";

type EventDetailsProps = {
  event: any;
};

export const EventDetails = (event: EventDetailsProps) => {
  const { t } = useTranslation();
  const { data: canParticipate } = useCan({
    action: "participate",
    resource: "events",
  });

  const { data: canShowEvent } = useCan({
    action: "show",
    resource: "events",
  });
  const tabs = [
    {
      label: t("events.tabs.information"),
      icon: LuInfo,
      value: "information",
      depends: canShowEvent?.can,
    },
    {
      label: t("events.tabs.program"),
      icon: LuClipboardList,
      value: "program",
      depends: true,
    },
    {
      label: t("events.tabs.partner"),
      icon: LuUsers,
      value: "partner",
      depends: false,
    },
    {
      label: t("events.tabs.login"),
      icon: LuLogIn,
      value: "login",
      depends: canParticipate?.can,
    },
  ];

  return (
    <Tabs.Root defaultValue="information" fitted variant="enclosed">
      <Tabs.List>
        {tabs.map(
          (tab) =>
            tab.depends && (
              <Tabs.Trigger key={tab.value} value={tab.value}>
                <tab.icon />
                {tab.label}
              </Tabs.Trigger>
            ),
        )}
      </Tabs.List>
      <Tabs.Content value="information">
        {/* Information Content */}
        <Information event={event.event} />
      </Tabs.Content>
      <Tabs.Content value="program">
        {/* Program Content */}
        <Program event={event.event} />
      </Tabs.Content>
      <Tabs.Content value="login">
        {/* Login Content */}
        <Login event={event.event} />
      </Tabs.Content>
    </Tabs.Root>
  );
};
