import * as React from "react";
import {
  Accordion,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Link,
  Span,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router";
import {
  useTranslation,
  useNavigation,
  useShow,
  useDelete,
} from "@refinedev/core";
import {
  LuCircleUser,
  LuLogIn,
  LuLogs,
  LuPresentation,
  LuSettings,
  LuShieldCheck,
  LuUsers,
} from "react-icons/lu";

interface AdminNavigationProps {
  sizes: number[];
}

export const AdminNavigation: React.FC<AdminNavigationProps> = ({ sizes }) => {
  const { translate: t } = useTranslation();
  const { show, list } = useNavigation();

  const collapsed = sizes[0] == 5;

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
        <Accordion.Item
          key={navItem.label}
          value={navItem.label}
          disabled={collapsed}
        >
          <Accordion.ItemTrigger>
            <Flex
              direction="row"
              align="center"
              justify={collapsed ? "center" : "flex-start"}
              w="100%"
              gap={2}
              height={7}
              px={collapsed ? 0 : "2.4vh"}
              mb={0}
              _hover={{ bg: "ui.hover" }}
              cursor="pointer"
            >
              <navItem.icon />
              {!collapsed && (
                <Span textAlign="center">
                  {t(`admin.folder.${navItem.label.toLowerCase()}`)}
                </Span>
              )}
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
