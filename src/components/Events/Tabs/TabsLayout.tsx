import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

const TabsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="xl"
      boxShadow="md"
      bg="white"
      maxW="800px"
      mx="auto"
      display="flex"
      flexDirection="column"
      gap={6}
    >
      {children}
    </Box>
  );
};

export default TabsLayout;
