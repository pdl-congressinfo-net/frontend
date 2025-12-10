import * as React from "react";
import { Box, Container, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "@refinedev/core";
import NavBar from "./NavBar";
import { Toaster } from "../ui/toaster";
import { ToasterMobile } from "../ui/toasterMobile";
import { useLayout } from "../../providers/layout-provider";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { translate } = useTranslation();
  const { title, actions } = useLayout();

  return (
    <Flex direction="column" minHeight="100vh">
      {/* Header */}
      <NavBar />

      {/* Main Content */}
      <Box as="main" flex="1" bg="ui.background" width="80%" mx="auto" py={6}>
        <Flex justify="space-between" mb={4}>
          {title && <Heading>{title}</Heading>}
          {actions && <Box mb={4}>{actions}</Box>}
        </Flex>

        <Container>{children}</Container>
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
