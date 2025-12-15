import { Accordion, Button, Flex, Span } from "@chakra-ui/react";
import { useNavigation, useTranslation } from "@refinedev/core";
import * as React from "react";
import {
  LuCircleUser,
  LuLogs,
  LuPresentation,
  LuSettings,
  LuUsers,
} from "react-icons/lu";

interface AdminNavigationProps {}

export const AdminNavigation: React.FC<AdminNavigationProps> = () => {
  const { translate: t } = useTranslation();
  const { show, list } = useNavigation();

  const navigation = [
    {
      label: "Events",
      icon: LuPresentation,
      ressources: ["events", "event-types"],
    },
    {
      label: "UserManagement",
      icon: LuCircleUser,
      ressources: ["users", "companies", "locations"],
    },
    {
      label: "AccessControl",
      icon: LuUsers,
      ressources: ["roles", "permissions"],
    },
    { label: "Settings", icon: LuSettings, ressources: ["settings"] },
    { label: "Logs", icon: LuLogs, ressources: ["logs"] },
  ];

  return (
    <Accordion.Root multiple variant="outline">
      {navigation.map((navItem) => (
        <Accordion.Item key={navItem.label} value={navItem.label}>
          <Accordion.ItemTrigger>
            <Flex
              direction="row"
              align="center"
              justify="flex-start"
              w="100%"
              gap={2}
              height={7}
              px={0}
              mb={0}
              _hover={{ bg: "ui.hover" }}
              cursor="pointer"
            >
              <navItem.icon scale={20} />

              <Span textAlign="center">
                {t(`admin.folder.${navItem.label.toLowerCase()}`)}
              </Span>
            </Flex>
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <Flex direction="column" ms={5} mt={-4} mb={4} gap={-1}>
                {navItem.ressources.map((ressource) => (
                  <Button
                    onClick={() => list(ressource)}
                    key={ressource}
                    variant="ghost"
                    justifyContent={"flex-start"}
                    _hover={{
                      bg: "white",
                      color: "blue.500",
                      fontStyle: "underline",
                    }}
                    ps={7}
                  >
                    {t(`admin.links.${ressource}`)}
                  </Button>
                ))}
              </Flex>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};
