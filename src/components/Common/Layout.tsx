import * as React from "react";
import { Box, Container, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "@refinedev/core";
import NavBar from "./NavBar";
import { Toaster } from "../ui/toaster";
import { ToasterMobile } from "../ui/toasterMobile";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { translate } = useTranslation();

  return (
    <Flex direction="column" minHeight="100vh">
      {/* Header */}
      <NavBar />

      {/* Main Content */}
      {children}

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
