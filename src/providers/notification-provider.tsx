import { NotificationProvider } from "@refinedev/core";
import { toaster } from "../components/ui/toaster";
import { toasterMobile } from "../components/ui/toasterMobile";

/**
 * Check out the Notification Provider documentation for detailed information
 * https://refine.dev/docs/api-reference/core/providers/notification-provider/
 **/
export const notificationProvider: NotificationProvider = {
  open: ({
    message,
    type,
    description,
    key,
    cancelMutation,
    undoableTimeout,
  }) => {
    // Map Refine notification types to Chakra toast types
    const toastType = type === "progress" ? "loading" : type;

    // Determine if mobile based on screen width
    const isMobile = window.innerWidth < 768;
    const selectedToaster = isMobile ? toasterMobile : toaster;

    // Create the toast
    selectedToaster.create({
      id: key,
      title: message,
      description: description,
      type: toastType,
      duration: undoableTimeout || (toastType === "loading" ? undefined : 5000),
      closable: toastType !== "loading",
      action: cancelMutation
        ? {
            label: "Undo",
            onClick: () => cancelMutation(),
          }
        : undefined,
    });
  },
  close: (key: string) => {
    // Try to dismiss from both toasters
    toaster.dismiss(key);
    toasterMobile.dismiss(key);
  },
};
