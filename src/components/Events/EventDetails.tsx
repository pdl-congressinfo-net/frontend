import { Tabs } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { LuInfo, LuClipboardList, LuLogIn, LuUsers } from "react-icons/lu";

import Information from "./Tabs/Information";
import Login from "./Tabs/Login";
import Program from "./Tabs/Program";

export const EventDetails = () => {
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
            )
        )}
      </Tabs.List>
      <Tabs.Content value="information">
        {/* Information Content */}
        <Information
          event={{
            c_veranst: "Daniel Pfurner",
            c_local: "Innsbruck, Austria",
            c_str: "THis is a Test Street 12",
          }}
        />
      </Tabs.Content>
      <Tabs.Content value="program">
        {/* Program Content */}
        <Program
          days={[
            {
              date: new Date("2024-03-30"),
              sessions: [
                {
                  time: "09:00",
                  description: "Opening Ceremony",
                  speaker: "Dr. Jane Smith",
                },
                {
                  time: "10:30",
                  description: "Keynote: Future of Technology",
                  speaker: "Prof. John Doe",
                },
                {
                  time: "14:00",
                  description: "Workshop: React Best Practices",
                  speaker: "Sarah Johnson",
                },
              ],
            },
            {
              date: new Date("2024-03-31"),
              sessions: [
                {
                  time: "09:30",
                  description: "Panel Discussion: AI and Ethics",
                  speaker: "Various Speakers",
                },
                {
                  time: "11:00",
                  description: "Technical Session: Cloud Architecture",
                  speaker: "Michael Chen",
                },
                {
                  time: "15:30",
                  description: "Networking Event",
                  speaker: "",
                },
              ],
            },
            {
              date: new Date("2024-04-01"),
              sessions: [
                {
                  time: "10:00",
                  description: "Closing Keynote",
                  speaker: "Dr. Emily Brown",
                },
                {
                  time: "12:00",
                  description: "Award Ceremony",
                  speaker: "",
                },
              ],
            },
          ]}
        />
      </Tabs.Content>
      <Tabs.Content value="login">
        {/* Login Content */}
        <Login
          event={{
            c_meldeinfo: "Dieser Kongress ist gratis",
          }}
          fees={[
            {
              id: 1,
              regular: "500",
              earlyBird: "400",
              info: "Standard registration fee",
              category: "Regular Participant",
            },
            {
              id: 2,
              regular: "300",
              earlyBird: "250",
              info: "Discounted rate for students",
              category: "Student",
            },
            {
              id: 3,
              regular: "700",
              earlyBird: "600",
              info: "Full access pass with workshops",
              category: "Premium Member",
            },
          ]}
        />
      </Tabs.Content>
    </Tabs.Root>
  );
};
