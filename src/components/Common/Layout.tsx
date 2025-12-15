import { Flex } from "@chakra-ui/react";
import { useTranslation } from "@refinedev/core";
import * as React from "react";
import { Footer } from "./Footer";
import NavBar from "./NavBar";

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
      <Footer />
    </Flex>
  );
};
