import { useShow } from "@refinedev/core";
import { useState } from "react";
import { EventDetails } from "../../components/Events/EventDetails";
import EventDetailsDialog from "../../components/Events/EventDetailsDialog";
import { useLocation, useNavigate } from "react-router-dom";

export const EventShow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const eventFromState = location.state?.event;
  const close = () => {
    // if there's a history index (React Router v6 stores idx) go back, otherwise go to /events
    const bg = location.state?.background;
    const fallback = location.state?.fallback ?? "/events";

    if (bg) {
      // Return to the background location
      navigate(bg.pathname + bg.search + bg.hash, { replace: true });
    } else {
      // Fallback for direct URL visits
      navigate(fallback, { replace: true });
    }

    setDetailsDialog({ isOpen: false, event: null });
  };
  const [detailsDialog, setDetailsDialog] = useState<{
    isOpen: boolean;
    event: Event | null;
  }>({ isOpen: true, event: null });

  return (
    <EventDetailsDialog
      isOpen={detailsDialog.isOpen}
      onClose={close}
      title={eventFromState?.name}
    >
      <EventDetails event={eventFromState} />
    </EventDetailsDialog>
  );
};
