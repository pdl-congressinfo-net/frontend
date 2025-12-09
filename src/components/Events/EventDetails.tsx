import { Tabs } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { LuInfo, LuClipboardList, LuLogIn, LuUsers } from "react-icons/lu";

import Information from "./Tabs/Information";
import Login from "./Tabs/Login";
import Program from "./Tabs/Program";
import { any } from "zod";

type EventDetailsProps = {
  event: any;
};

export const EventDetails = (event: EventDetailsProps) => {
  const { t } = useTranslation();
  const tabs = [
    {
      label: t("events.information"),
      icon: LuInfo,
      value: "information",
      depends: true,
    },
    {
      label: t("events.program"),
      icon: LuClipboardList,
      value: "program",
      depends: true,
    },
    {
      label: t("events.partner"),
      icon: LuUsers,
      value: "partner",
      depends: false,
    },
    { label: t("events.login"), icon: LuLogIn, value: "login", depends: true },
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
