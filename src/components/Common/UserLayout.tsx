import * as React from "react";
import { Box, Container, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "@refinedev/core";
import NavBar from "./NavBar";
import { Toaster } from "../ui/toaster";
import { ToasterMobile } from "../ui/toasterMobile";
import { useLayout } from "../../providers/layout-provider";

interface UserLayoutProps {
  children: React.ReactNode;
}

export const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const { translate } = useTranslation();
  const { title, actions } = useLayout();

  return (
    <Box as="main" flex="1" bg="ui.background" width="80%" mx="auto" py={6}>
      <Flex justify="space-between" mb={4}>
        {title && <Heading>{title}</Heading>}
        {actions && <Box mb={4}>{actions}</Box>}
      </Flex>

      <Container>{children}</Container>
    </Box>
  );
};
