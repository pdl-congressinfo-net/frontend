import { Box, Button, Card, Flex, Heading, HStack } from "@chakra-ui/react";
import { useBack, useTranslation } from "@refinedev/core";
import * as React from "react";
import { LuArrowLeft } from "react-icons/lu";
import { useLayout } from "../../providers/layout-provider";
import { AdminNavigation } from "./AdminNavigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { translate } = useTranslation();
  const back = useBack();
  const { title, actions, contentTitle } = useLayout();

  return (
    <Box as="main" flex="1" bg="ui.background" width="80%" mx="auto">
      <Flex>
        <Box width="20%" minHeight="100vh" bg="ui.surface">
          <AdminNavigation />
        </Box>
        <Box width="80%" p={6}>
          <Box layerStyle="pageHeader">
            <Flex justify="space-between" align="center" gap={4}>
              {contentTitle ? (
                <Box>{contentTitle}</Box>
              ) : (
                <Heading textStyle="pageTitle">{title}</Heading>
              )}
              <HStack layerStyle="actionBar">
                {actions}
                <Button onClick={() => back()} variant="ghost">
                  <LuArrowLeft />
                  {translate("common.back", "Back")}
                </Button>
              </HStack>
            </Flex>
          </Box>
          <Card.Root p={4} mt={4}>
            {children}
          </Card.Root>
        </Box>
      </Flex>
    </Box>
  );
};
