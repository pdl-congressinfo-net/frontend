import { Box, Container, Flex, Image } from "@chakra-ui/react";
import { useTranslation, useLink } from "@refinedev/core";
import { UserButton } from "../User/UserButton";
import { AccountDialog } from "../User/AccountDialog";
import { LanguageToggle } from "./LanguageToggle";
import { useState } from "react";

const NavBar = () => {
  const { translate } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isOpen = isDialogOpen;
  const onClose = () => setIsDialogOpen(false);

  const Link = useLink();

  return (
    <Box
      as="header"
      borderBottomWidth="1px"
      borderBottomColor="gray.200"
      bg="ui.surface"
      px={4}
      py={3}
    >
      <Flex align="center" justify="space-between">
        <Container
          maxW="container.xl"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Link
            to="/"
            _focus={{
              outline: "none",
              boxShadow: "none",
            }}
          >
            <Image
              src="/assets/images/congressinfo_logo_vektor.svg"
              alt={translate("common.projectName")}
              height="35px"
            />
          </Link>
        </Container>
        <Flex align="center" gap={2}>
          <LanguageToggle />
          <UserButton />
        </Flex>
        <AccountDialog isOpen={isOpen} onClose={onClose} />
      </Flex>
    </Box>
  );
};

export default NavBar;
