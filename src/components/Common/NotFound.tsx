import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useTranslation } from "@refinedev/core";
import { useNavigate } from "react-router";
import { useLayout } from "../../providers/layout-provider";

export default function NotFound() {
  const { translate: t } = useTranslation();

  const navigate = useNavigate();
  const { setTitle, setActions } = useLayout();

  setTitle("");
  setActions(null);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container maxW="container.md" py={20}>
      <VStack gap={8} textAlign="center">
        <Box>
          <Heading
            fontSize={{ base: "6xl", md: "8xl" }}
            fontWeight="bold"
            bgGradient="to-r"
            gradientFrom="blue.400"
            gradientTo="purple.600"
            bgClip="text"
          >
            404
          </Heading>
        </Box>

        <VStack gap={4}>
          <Heading size="2xl" fontWeight="semibold">
            {t("common.notFound.pageNotFound")}
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="md">
            {t("common.notFound.description")}
          </Text>
        </VStack>

        <VStack gap={3} width="full" maxW="xs">
          <Button
            colorScheme="blue"
            size="lg"
            width="full"
            onClick={handleGoBack}
          >
            {t("common.notFound.goBack")}
          </Button>
          <Button
            variant="outline"
            colorScheme="blue"
            size="lg"
            width="full"
            onClick={handleGoHome}
          >
            {t("common.notFound.goToHome")}
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
}
