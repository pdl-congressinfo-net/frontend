import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProgrammEditPage = () => {
  const { id, eventId } = useParams<{ id: string; eventId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to list page with edit query param
    navigate(`/admin/events/${eventId}/programm?editProgramm=${id}`, {
      replace: true,
    });
  }, [id, eventId, navigate]);

  return null;
};

export default ProgrammEditPage;
