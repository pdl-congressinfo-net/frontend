import { Box, Container } from "@chakra-ui/react";
import { useTranslation } from "@refinedev/core";
import * as React from "react";
import { Toaster } from "../ui/toaster";
import { ToasterMobile } from "../ui/toasterMobile";

export const Footer: React.FC = () => {
  const { translate } = useTranslation();

  return (
    <>
      <ToasterMobile />
      <Toaster />
      <Box
        as="footer"
        borderTopWidth="1px"
        borderTopColor="gray.200"
        bg="ui.surface"
        px={4}
        py={4}
        maxH={"8vh"}
        minH={"8vh"}
      >
        <Container maxW="container.xl">
          <Box fontSize="sm" color="ui.muted" textAlign="center">
            © {new Date().getFullYear()} {translate("common.projectName")}
            {" | "}
            {translate("common.allRightsReserved")}
          </Box>
        </Container>
      </Box>
    </>
  );
};
