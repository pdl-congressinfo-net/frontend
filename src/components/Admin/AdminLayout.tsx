import * as React from "react";
import { Box, Container, Flex, Splitter } from "@chakra-ui/react";
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
    <Flex direction="column" minHeight="100vh">
      {/* Header */}
      <NavBar />

      {/* Main Content */}
      <Box as="main" flex="1" bg="ui.background" width="80%" mx="auto">
        <Flex>
          <Box width={sizes[0] + "%"} minHeight="100vh" bg="ui.surface">
            <AdminNavigation sizes={sizes} />
          </Box>
          <Box width={sizes[1] + "%"} p={6}>
            {children}
          </Box>
        </Flex>
      </Box>

      {/* Footer */}
      <ToasterMobile />
      <Toaster />
      <Box
        as="footer"
        borderTopWidth="1px"
        borderTopColor="gray.200"
        bg="ui.surface"
        px={4}
        py={4}
      >
        <Container maxW="container.xl">
          <Box fontSize="sm" color="ui.muted" textAlign="center">
            © {new Date().getFullYear()} {translate("common.projectName")}
            {" | "}
            {translate("common.allRightsReserved")}
          </Box>
        </Container>
      </Box>
    </Flex>
  );
};
