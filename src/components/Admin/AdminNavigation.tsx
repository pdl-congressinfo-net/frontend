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

  // Control open accordion values and cap at 2 simultaneously
  const [openValues, setOpenValues] = React.useState<string[]>([]);
  const handleValueChange = (details: { value: string[] }) => {
    const next = details.value ?? [];
    if (next.length <= 2) {
      setOpenValues(next);
    } else {
      // keep most recent two by preserving order from details
      setOpenValues(next.slice(-2));
    }
  };

  const navigation = [
    {
      label: "Events",
      icon: LuPresentation,
      ressources: ["events", "types"],
    },
    {
      label: "UserManagement",
      icon: LuCircleUser,
      ressources: ["users", "contacts", "companies", "locations"],
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
    <Accordion.Root
      multiple
      variant="outline"
      value={openValues}
      onValueChange={handleValueChange as any}
    >
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
              <Flex direction="column" ms={5} mb={4} gap={-1}>
                {navItem.ressources.map((ressource) => (
                  <Button
                    onClick={() => list(ressource)}
                    key={ressource}
                    variant="ghost"
                    justifyContent={"flex-start"}
                    _hover={{
                      bg: "gray.100",
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
