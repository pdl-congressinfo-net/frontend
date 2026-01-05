import { Dialog, Flex, Image, Portal } from "@chakra-ui/react";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const EventDialog = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: EventDialogProps) => {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      size="xl"
      motionPreset="slide-in-bottom"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Flex direction="column" align="start" gap={4}>
                <Image
                  src="/assets/headers/506.png"
                  alt="Event"
                  borderRadius="md"
                  width="100%"
                  objectFit="cover"
                />
                <Dialog.Title>{title}</Dialog.Title>
              </Flex>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body>{children}</Dialog.Body>
            {footer && <Dialog.Footer>{footer}</Dialog.Footer>}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
