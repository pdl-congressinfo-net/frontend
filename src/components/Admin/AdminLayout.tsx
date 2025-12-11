import * as React from "react";
import { Box, Card, Container, Flex, Splitter } from "@chakra-ui/react";
import { useTranslation } from "@refinedev/core";
import NavBar from "../Common/NavBar";
import { Toaster } from "../ui/toaster";
import { ToasterMobile } from "../ui/toasterMobile";
import { useLayout } from "../../providers/layout-provider";
import { AdminNavigation } from "./AdminNavigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { translate } = useTranslation();
  const [sizes, setSizes] = React.useState<number[]>([20, 80]);
  const { title, actions } = useLayout();

  return (
    <Box as="main" flex="1" bg="ui.background" width="80%" mx="auto">
      <Flex>
        <Box width={sizes[0] + "%"} minHeight="100vh" bg="ui.surface">
          <AdminNavigation sizes={sizes} />
        </Box>
        <Box width={sizes[1] + "%"} p={6}>
          <Card.Root p={4}>{children}</Card.Root>
        </Box>
      </Flex>
    </Box>
  );
};
