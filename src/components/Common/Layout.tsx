import { Flex } from "@chakra-ui/react";
import * as React from "react";
import { Footer } from "./Footer";
import NavBar from "./NavBar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
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
