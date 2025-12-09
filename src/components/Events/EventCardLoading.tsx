import { Card, Flex, Skeleton, Box, SkeletonText } from "@chakra-ui/react";

export const EventCardLoading = () => {
  return (
    <Card.Root
      size="md"
      borderWidth="1px"
      borderRadius="md"
      dropShadow="md"
      cursor="pointer"
      padding={4}
    >
      <Flex direction="row" justifyContent="space-between" gap={4}>
        {/* Image placeholder */}
        <Skeleton height="150px" width="150px" borderRadius="md" />

        {/* Right section */}
        <Card.Body width="100%">
          <Flex direction="row" gap={2} mb={2}>
            {/* Title + Date column */}
            <Flex direction="column" flex="1">
              {/* Event Title */}
              <Skeleton height="20px" width="70%" mb={2} />

              {/* Date */}
              <Skeleton height="14px" width="40%" />
            </Flex>

            {/* Buttons column */}
            <Flex direction="column" justifyContent="space-between" ml="auto">
              <Flex direction="column" alignItems="flex-end" gap={2}>
                {/* Participate Button */}
                <Skeleton height="36px" width="8vw" borderRadius="md" />
              </Flex>
            </Flex>
          </Flex>

          {/* Location */}
          <Box fontSize="sm" mt={2}>
            <Skeleton height="14px" width="30%" />
          </Box>
        </Card.Body>
      </Flex>
    </Card.Root>
  );
};
