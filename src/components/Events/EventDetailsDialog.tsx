import { Button, Dialog, Text } from "@chakra-ui/react";
import { EventDialog } from "./EventDialog";

interface EventDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const EventDetailsDialog = ({
  isOpen,
  onClose,
  title,
  children,
}: EventDetailsDialogProps) => {
  return (
    <EventDialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <Dialog.ActionTrigger asChild>
          <Button variant="outline" onClick={onClose}>
            Schließen
          </Button>
        </Dialog.ActionTrigger>
      }
    >
      {children}
    </EventDialog>
  );
};

export default EventDetailsDialog;
